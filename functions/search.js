const admin = require('firebase-admin');
const functions = require('firebase-functions');
const StreamArray = require( 'stream-json/streamers/StreamArray');

let SEARCH_INDEX = undefined;
let SEARCH_INDEX_READ_PROMISE = undefined;

async function readSearchIndex() {
  SEARCH_INDEX_READ_PROMISE = new Promise((resolve, reject) => {
    try {
      const bucket = admin.storage().bucket();
      const file = bucket.file('search-index.json', {});
      const readStream = file.createReadStream();
      const jsonStream = StreamArray.withParser();
      const searchIndex = [];

      functions.logger.log('Reading search index json');

      readStream.pipe(jsonStream.input);
      jsonStream.on('data', ({ key, value }) => {
        return searchIndex[key] = value;
      });
      jsonStream.on('end', () => {
        functions.logger.log('Finished reading search index json');
        SEARCH_INDEX = searchIndex;
        SEARCH_INDEX_READ_PROMISE = undefined;
        resolve();
      });
    } catch(e) {
      reject(e);
    }
  });

  return SEARCH_INDEX_READ_PROMISE;
}

exports.searchGames = functions.https.onRequest(async (request, response) => {
  if (!SEARCH_INDEX) {
    if (SEARCH_INDEX_READ_PROMISE) {
      await SEARCH_INDEX_READ_PROMISE;
    } else {
      await readSearchIndex();
    }
  }

  const query = request.query.search.toLowerCase();
  const matches = SEARCH_INDEX.filter(i => i.name.toLowerCase().indexOf(query) > -1);

  if (matches.length) {
    functions.logger.log(`Found ${matches.length} matches for '${query}'`);
    response.status(200).json(matches);
  } else {
    functions.logger.log(`No match for '${query}'`);
    response.status(404).json({message: 'Not found'});
  }
});
