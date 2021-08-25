const axios = require('axios');
const axiosRetry = require('axios-retry');

const TOKEN_EXPIRATION_THRESHOLD = 30000;
const REQUEST_RETRY_DELAY = 500;
let TOKEN;

axiosRetry(axios, {
  retries: 3,
  retryDelay: retryCount => REQUEST_RETRY_DELAY,
  retryCondition: e => e.response.status === 429,
});

module.exports = (admin, functions) => {
  const db = admin.firestore();
  const tokenDocRef = db.collection('igdb').doc('token');

  async function getStoredToken() {
    return await tokenDocRef.get().then(r => r.data());
  }

  async function getTokenFromIGDB() {
    const path = `https://id.twitch.tv/oauth2/token?client_id=${functions.config().igdb.id}&client_secret=${functions.config().igbd.secret}&grant_type=client_credentials`;

    token = await axios({
      url: path,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
    })
    .then(r => r.data);
    token.expiry = (new Date()).getTime() + (token.expires_in * 1000);
    await tokenDocRef.set(token);

    return token;
  }

  async function getToken() {
    let token;

    if (TOKEN) {
      token = TOKEN;
      functions.logger.log('Using global IGDB token');
    } else {
      token = await getStoredToken();

      if (!token) {
        token = await getTokenFromIGDB();
        functions.logger.log('Fetching new IGDB token');
      } else {
        functions.logger.log('Using stored IGDB token');
      }
    }

    const now = (new Date()).getTime();

    if (token.expiry <= now + TOKEN_EXPIRATION_THRESHOLD) {
      token = await getTokenFromIGDB();
      functions.logger.log('IGDB token expired, fetching new one');
    }

    TOKEN = token;

    return token;
  }

  async function revokeToken() {
    const storedToken = await getStoredToken();

    if (storedToken) {
      const path = `https://id.twitch.tv/oauth2/revoke?client_id=${functions.config().igdb.id}&token=${storedToken}`;

      await axios({
        url: path,
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
      });

      TOKEN = undefined;
      await tokenDocRef.delete();
    }
  }

  async function makeIGDBRequest(path = '', query = {}) {
    const token = await getToken();
    const data = Object.keys(query).map(k => `${k} ${query[k]};`).join('');

    return await axios({
      url: `${path}`,
      method: 'POST',
      data,
      headers: {
        'Client-ID': functions.config().igdb.id,
        'Authorization': `Bearer ${token.access_token}`,
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
      },
    })
    .then(r => r.data);
  }

  async function fetchPageOfGames(limit, offset) {
    const fields = ['category', 'cover.*', 'first_release_date', 'genres', 'keywords.*', 'name', 'platforms', 'screenshots.*', 'summary', 'version_title', 'slug'];
    const path = `https://api.igdb.com/v4/games?limit=${limit}&offset=${offset}&fields=${fields.join(',')}`;

    const games = await makeIGDBRequest(path, 'GET');

    return games.map(game => {
      if (game.cover) {
        game.cover.url = game.cover.url.replace('/t_thumb/', '/t_cover_big/');
      }

      if (game.screenshots) {
        game.screenshots = game.screenshots.map(s => s.url = s.url.replace('/t_thumb/', '/t_screenshot_big/'));
      }

      return game;
    });
  }

  async function fetchGames(request, response) {
    try {
      const gamesIndex = [];
      const LIMIT = 500;
      const MAX_OFFSET = Infinity;
      const TIME_BETWEEN_REQUESTS = 500;
      const MAX_REQUESTS = 8;
      let offset = 0;
      let done = false;
      let finishing = false;
      let requestPromises = [];
      let lastRequestTime = -Infinity;

      const finish = function() {
        if (finishing) {
          return;
        }

        if (requestPromises.length) {
          setTimeout(finish);
          return;
        }

        finishing = true;
        response.status(200).send('done');
      }

      const fetch = async function() {
        const o = offset;

        offset += LIMIT;

        if (offset >= MAX_OFFSET) {
          done = true;
          return;
        }

        if (done) {
          return;
        }

        functions.logger.log(`Fetching games at offset ${o}`);

        const games = await fetchPageOfGames(LIMIT, o);

        if (!games || !games.length) {
          done = true;
        } else {
          const batch = db.batch();

          functions.logger.log(`Got ${games.length} games at offset ${o}`);

          games.forEach(game => {
            const { id, ...data } = game;
            db.collection('games').doc(id.toString()).set(data);

            gamesIndex.push({
              id,
              name: game.name,
              slug: game.slug,
            });
          });

          batch.commit();
        }
      }

      const next = async function() {
        if (done) {
          finish();
          return;
        }

        if (requestPromises.length >= MAX_REQUESTS) {
          setTimeout(next, 100);
          return;
        }

        const now = (new Date()).getTime();
        const timeSinceLastRequest = now - lastRequestTime;

        if (timeSinceLastRequest <= TIME_BETWEEN_REQUESTS) {
          setTimeout(next, TIME_BETWEEN_REQUESTS - timeSinceLastRequest);
          return
        }

        const promise = fetch();
        requestPromises.push(promise);
        await promise;
        requestPromises = requestPromises.filter(p => p !== promise);
        next();
      }

      // run 4 tasks in parallel

      next();
      next();
      next();
      next();
    } catch(e) {
      response.status(500).send(e.message);
    }
  }

  // fixme: There may some day be more than 500 platforms and exceed the max batch size
  //        allowed by firestore.

  async function fetchPlatforms(request, response) {
    try {
      const fields = ['name', 'id', 'abbreviation', ];
      const path = `https://api.igdb.com/v4/platforms?limit=500&fields=${fields.join(',')}`;

      const platforms = await makeIGDBRequest(path, 'GET');

      // Save new platforms

      const batch = db.batch();

      platforms.forEach(platform => {
        const { id, ...data } = platform;
        db.collection('platforms').doc(id.toString()).set(data);
      });

      batch.commit();

      response.status(200).send(platforms);
    } catch(e) {
      response.status(500).send(e.message);
    }
  }

  const searchGames = async data => {
    const search = ((data.data ? data.data : data).search || '');
    const fields = ['category', 'cover.*', 'first_release_date', 'name', 'platforms', 'slug'];
    const path = `https://api.igdb.com/v4/games`;
    const games = await makeIGDBRequest(path, {
      search: `"${search.replace('"', '')}"`,
      fields: fields.join(','),
      limit: 20,
    });

    return games;
  };

  return {
    fetchGames: functions.runWith({ timeoutSeconds: 540, memory: '8GB' }).https.onRequest(fetchGames),
    fetchPlatforms: functions.https.onRequest(fetchPlatforms),
    searchGames: functions.https.onCall(searchGames),
  };
};

