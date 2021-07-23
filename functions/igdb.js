const axios = require('axios');

exports.functions = (admin, functions) => {
  const db = admin.firestore();

  function getToken() {
    const path = `https://id.twitch.tv/oauth2/token?client_id=${functions.config().igdb.id}&client_secret=${functions.config().igbd.secret}&grant_type=client_credentials`;

    return axios({
      url: path,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
    })
    .then(function(r) {
      return r.data;
    })
    .catch(e => {
      throw(e);
    });
  }

  function revokeToken(token) {
    const path = `https://id.twitch.tv/oauth2/revoke?client_id=${functions.config().igdb.id}&token=${token}`;

    return axios({
      url: path,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
    })
    .then(function(r) {
      return r.data;
    })
    .catch(e => {
      throw(e);
    });
  }

  async function fetchPageOfGames(token, limit, offset) {
    const fields = ['category', 'cover.*', 'first_release_date', 'genres', 'keywords.*', 'name', 'platforms', 'screenshots.*', 'summary', 'version_title'];
    const path = `https://api.igdb.com/v4/games?limit=${limit}&offset=${offset}&fields=${fields.join(',')}`;

    return await axios({
      url: path,
      method: 'GET',
      headers: {
        'Client-ID': functions.config().igdb.id,
        'Authorization': `Bearer ${token.access_token}`,
        'Accept': 'application/json',
      },
    })
    .then(async function(r) {
      return(r.data.map(game => {
        if (game.cover) {
          game.cover.url = game.cover.url.replace('/t_thumb/', '/t_cover_big/');
        }
        if (game.screenshots) {
          game.screenshots = game.screenshots.map(s => s.url = s.url.replace('/t_thumb/', '/t_screenshot_big/'));
        }

        return game;
      }));
    })
    .catch(function(e) {
      throw(e);
    });
  }

  const fetchGames = functions.https.onRequest(async (request, response) => {
    try {
      const token = await getToken();

      const limit = 500;
      const maxOffset = 2000;
      const waitTime = 1000;
      let offset = 0;
      let done = false;
      const searchIndex = [];

      while (!done) {
        const games = await fetchPageOfGames(token, limit, offset);

        if (!games || !games.length) {
          done = true;
        } else {
          const batch = db.batch();

          functions.logger.log(`Got ${games.length} games`);

          games.forEach(game => {
            const { id, ...data } = game;
            db.collection('games').doc(id.toString()).set(data);

            searchIndex.push({
              id,
              name: game.name,
            });
          });

          batch.commit();

          offset += limit;

          if (offset >= maxOffset) {
            done = true;
          } else {
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        }
      }

      const bucket = admin.storage().bucket();
      const file = bucket.file('search-index.json', {});

      file.save(JSON.stringify(searchIndex), e => {
        if (!e) {
          functions.logger.log('Wrote search index to file');
          revokeToken(token);
          response.status(200).send('done');
        } else {
          response.status(500).send(e.message);
        }
      });
    } catch(e) {
      response.status(500).send(e.message);
    }
  });

  // fixme: There may some day be more than 500 platforms and exceed the max batch size
  //        allowed by firestore.

  const fetchPlatforms = functions.https.onRequest(async (request, response) => {
    try {
      const token = await getToken();
      const fields = ['name', 'id', 'abbreviation', ];
      const path = `https://api.igdb.com/v4/platforms?limit=500&fields=${fields.join(',')}`;

      const platforms = await axios({
        url: path,
        method: 'GET',
        headers: {
          'Client-ID': functions.config().igdb.id,
          'Authorization': `Bearer ${token.access_token}`,
          'Accept': 'application/json',
        },
      })
      .then(async function(r) {
        return r.data;
      })
      .catch(function(e) {
        throw(e);
      });

      // Save new platforms

      const batch = db.batch();

      platforms.forEach(platform => {
        const { id, ...data } = platform;
        db.collection('platforms').doc(id.toString()).set(data);
      });

      batch.commit();

      revokeToken(token);

      response.status(200).send(platforms);
    } catch(e) {
      response.status(500).send(e.message);
    }
  });

  return {
    fetchGames,
    fetchPlatforms,
  };
};

