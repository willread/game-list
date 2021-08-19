require('cors')({
  origin: '*', // fixme
});
const { Document } = require('flexsearch');

const MAX_MATCHES = 20;
const SEARCH_DOCUMENT_OPTIONS = {
  id: 'id',
  index: ['name'],
  preset: 'performance',
  tokenize: 'full',
};

let ADMIN;
let FUNCTIONS;
let GAMES_INDEX;
let GAMES_INDEX_READ_PROMISE;
let SEARCH_DOCUMENTS;
let SEARCH_DOCUMENTS_READ_PROMISE;

async function readGamesIndex() {
  if (!GAMES_INDEX) {
    if (!GAMES_INDEX_READ_PROMISE) {
      GAMES_INDEX_READ_PROMISE = new Promise((resolve, reject) => {
        try {
          const bucket = ADMIN.storage().bucket();
          const file = bucket.file('search-index.json', {}); // TODO: Rename to `games-index.json` after next run as file has changed names
          const readStream = file.createReadStream();

          FUNCTIONS.logger.log('Reading games index json');

          let json = '';
          readStream.on('data', chunk => {
            json += chunk;
          });
          readStream.on('end', () => {
            FUNCTIONS.logger.log('Finished reading games index json');
            GAMES_INDEX = JSON.parse(json);
            resolve();
          });
        } catch(e) {
          FUNCTIONS.logger.error('Error reading JSON stream: ', e);
          reject(e);
        }
      });
    }
  }

  return GAMES_INDEX_READ_PROMISE;
}

async function generateSearchDocuments(request, response) {
  await readGamesIndex();

  const docs = new Document(SEARCH_DOCUMENT_OPTIONS);
  const bucket = ADMIN.storage().bucket();
  const file = bucket.file('search-documents.json', {});

  FUNCTIONS.logger.log('Adding search documents');
  GAMES_INDEX.forEach(doc => docs.add(doc));
  FUNCTIONS.logger.log('Exporting search documents');

    // flexsearch currently has no way to determine when an export has finished,
    // so for now we're waiting until some time has passed since the last data
    // was received.
    // issue here: https://github.com/nextapps-de/flexsearch/issues/235

  let exportedData = {};
  let finishTimeout;

  function finish() {
    file.save(JSON.stringify(exportedData), e => {
      if (!e) {
        FUNCTIONS.logger.log('Wrote search documents to file');
        response.status(200).send('done');
      } else {
        response.status(500).send(e.message);
      }
    });
  }

  docs.export((key, data) => {
    FUNCTIONS.logger.log(`Exported some data for ${key} (${data ? data.length : 0}`);
    exportedData[key] = data;

    clearTimeout(finishTimeout);
    finishTimeout = setTimeout(finish, 100);
  });
}

async function readSearchDocuments() {
  if (!SEARCH_DOCUMENTS) {
    if (!SEARCH_DOCUMENTS_READ_PROMISE) {
      SEARCH_DOCUMENTS_READ_PROMISE = new Promise((resolve, reject) => {
        try {
          const bucket = ADMIN.storage().bucket();
          const file = bucket.file('search-documents.json', {});
          const readStream = file.createReadStream();

          FUNCTIONS.logger.log('Reading search documents json');

          let json = '';
          readStream.on('data', chunk => {
            json += chunk;
          });
          readStream.on('end', () => {
            FUNCTIONS.logger.log('Finished reading search documents json');
            SEARCH_DOCUMENTS = new Document(SEARCH_DOCUMENT_OPTIONS);
            const importedData = JSON.parse(json);
            Object.keys(importedData).forEach(key => {
              SEARCH_DOCUMENTS.import(key, importedData[key]);
            });
            resolve();
          });
        } catch(e) {
          FUNCTIONS.logger.error('Error reading search documents: ', e);
          reject(e);
        }
      });
    }
  }

  return SEARCH_DOCUMENTS_READ_PROMISE;
}

async function searchGames({data}) {
  try {
    await readGamesIndex();
    await readSearchDocuments();

    const query = (data.search || '').toLowerCase();

    FUNCTIONS.logger.log('Query', data);

    if (!query) {
      throw new FUNCTIONS.https.HttpsError('not-found', 'No query specified');
    } else {
      const results = SEARCH_DOCUMENTS.search(query, MAX_MATCHES);
      FUNCTIONS.logger.log('Results', results);
      if (results) {
        const nameResults = results.find(r => r.field === 'name');

        if (nameResults && nameResults.result.length){
          const games = nameResults.result.map(r => GAMES_INDEX.find(i => i.id == r));

          FUNCTIONS.logger.log(`Found ${games.length} matches for '${query}'`, games);

          return games;
        } else {
          throw new FUNCTIONS.https.HttpsError('not-found', 'todo');
        }
      } else {
        FUNCTIONS.logger.log(`No match for '${query}'`);
        throw new FUNCTIONS.https.HttpsError('not-found', 'todo');
      }
    }
  } catch(e) {
    throw e;
  }
}

exports.functions = (admin, functions) => {
  ADMIN = admin;
  FUNCTIONS = functions;

  try {
    return {
      searchGames: functions.runWith({ memory: '1GB' }).https.onCall(searchGames),
      generateSearchDocuments: functions.runWith({ memory: '1GB' }).https.onRequest(generateSearchDocuments),
    };
  } catch(e) {
    functions.logger.error('Error:', e);
  }
};
