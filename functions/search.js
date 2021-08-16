require('cors')({
  origin: '*', // FIXME
});
const { Document } = require('flexsearch');

const MAX_MATCHES = 20;

let SEARCH_INDEX = undefined;
let SEARCH_INDEX_READ_PROMISE = undefined;
let SEARCH_DOCUMENTS = undefined;

async function readSearchIndex(admin, functions) {
  SEARCH_INDEX_READ_PROMISE = new Promise((resolve, reject) => {
    try {
      const bucket = admin.storage().bucket();
      const file = bucket.file('search-index.json', {});
      const readStream = file.createReadStream();

      functions.logger.log('Reading search index json');

      let json = '';
      readStream.on('data', chunk => {
        json += chunk;
        // functions.logger.log('Got some data');
      });
      readStream.on('end', () => {
        functions.logger.log('Finished reading search index json');
        SEARCH_INDEX = JSON.parse(json);
        SEARCH_DOCUMENTS = new Document({
          id: 'id',
          index: ['name'],
          preset: 'performance',
          tokenize: 'full',
        });
        SEARCH_INDEX.forEach(doc => SEARCH_DOCUMENTS.add(doc));
        SEARCH_INDEX_READ_PROMISE = undefined;
        resolve();
      });
    } catch(e) {
      functions.logger.error('Error reading JSON stream: ', e);
      reject(e);
    }
  });

  return SEARCH_INDEX_READ_PROMISE;
}

exports.functions = (admin, functions) => {
  try {
    const searchGames = functions.https.onCall(async data => {
      try {
        if (!SEARCH_INDEX) {
          if (SEARCH_INDEX_READ_PROMISE) {
            await SEARCH_INDEX_READ_PROMISE;
          } else {
            await readSearchIndex(admin, functions);
          }
        }

        const query = (data.search || '').toLowerCase();

        if (!query) {
          throw new functions.https.HttpsError('not-found', 'todo');
        } else {
          const results = SEARCH_DOCUMENTS.search(query, MAX_MATCHES);

          if (results) {
            const nameResults = results.find(r => r.field === 'name');

            if (nameResults && nameResults.result.length){
              const games = nameResults.result.map(r => SEARCH_INDEX.find(i => i.id == r));

              functions.logger.log(`Found ${games.length} matches for '${query}'`, games);

              return games;
            } else {
              throw new functions.https.HttpsError('not-found', 'todo');
            }
          } else {
            functions.logger.log(`No match for '${query}'`);
            throw new functions.https.HttpsError('not-found', 'todo');
          }
        }
      } catch(e) {
        throw e;
      }
    });

    return {
      searchGames,
    };
  } catch(e) {
    functions.logger.error('Error:', e);
  }
};
