require('cors')({
  origin: '*', // fixme
});

const MAX_MATCHES = 10;

let GAMES_INDEX;
let GAMES_INDEX_READ_PROMISE;

module.exports = (admin, functions) => {
  async function readGamesIndex() {
    if (!GAMES_INDEX) {
      if (!GAMES_INDEX_READ_PROMISE) {
        GAMES_INDEX_READ_PROMISE = new Promise((resolve, reject) => {
          try {
            const bucket = admin.storage().bucket();
            const file = bucket.file('search-index.json', {}); // TODO: Rename to `games-index.json` after next run as file has changed names
            const readStream = file.createReadStream();

            functions.logger.log('Reading games index json');

            let json = '';
            readStream.on('data', chunk => {
              json += chunk;
            });
            readStream.on('end', () => {
              functions.logger.log('Finished reading games index json');
              GAMES_INDEX = JSON.parse(json);
              resolve();
            });
          } catch(e) {
            functions.logger.error('Error reading JSON stream: ', e);
            reject(e);
          }
        });
      }
    }

    return GAMES_INDEX_READ_PROMISE;
  }

  async function searchGames(data) {
    try {
      await readGamesIndex();

      const query = ((data.data ? data.data : data).search || '').toLowerCase();

      functions.logger.log('Query', data);

      if (!query) {
        throw new functions.https.HttpsError('not-found', 'No query specified');
      } else {
        const terms = query.split(/\s+/);
        const results = [];

        GAMES_INDEX.some(game => {
          const name = game.name.toLowerCase();

          if (terms.every(t => name.includes(t))) {
            results.push(game);
          }

          return results.length >= MAX_MATCHES;
        });

        if (results && results.length) {
          functions.logger.log(`Found ${results.length} matches for '${query}'`, results);

          return results;
        } else {
          functions.logger.log(`No match for '${query}'`);
          throw new functions.https.HttpsError('not-found', 'todo');
        }
      }
    } catch(e) {
      throw e;
    }
  }

  try {
    return {
      searchGames: functions.runWith({ memory: '1GB' }).https.onCall(searchGames),
    };
  } catch(e) {
    functions.logger.error('Error:', e);
  }
};
