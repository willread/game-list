const MAX_MATCHES = 20;

let SEARCH_INDEX = undefined;
let SEARCH_INDEX_READ_PROMISE = undefined;

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
        functions.logger.log('Got some data');
      });
      readStream.on('end', () => {
        functions.logger.log('Finished reading search index json');
        SEARCH_INDEX = JSON.parse(json);
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
          const matches = SEARCH_INDEX.filter(i => i.name && i.name.toLowerCase().indexOf(query) > -1);

          if (matches.length) {
            functions.logger.log(`Found ${matches.length} matches for '${query}'`);
            return matches.slice(0, MAX_MATCHES);
          } else {
            functions.logger.log(`No match for '${query}'`);
            throw new functions.https.HttpsError('not-found', 'todo');
          }
        }
      } catch(e) {
        throw new functions.https.HttpsError('unhandled-error', e.message);
      }
    });

    return {
      searchGames,
    };
  } catch(e) {
    functions.logger.error('Error:', e);
  }
};
