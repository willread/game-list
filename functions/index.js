const https = require('https');
const functions = require('firebase-functions');
const axios = require('axios');

function getToken() {
  const path = `/oauth2/token?client_id=${functions.config().igdb.id}&client_secret=${functions.config().igbd.secret}&grant_type=client_credentials`;

  return new Promise((resolve, reject) => {
    const req = https.request({
      host: 'id.twitch.tv',
      port: 443,
      path,
      method: 'POST',
    }, res => {
      let rawData = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { rawData += chunk; });
      res.on('end', () => {
          resolve(JSON.parse(rawData));
      });
    });
    req.on('error', e => {
        reject(e);
    });
    req.end();
  });
}

// TODO: Handle expiration
// TODO: Reuse http connection
// TODO: Use axios for all requests

exports.searchGames = functions.https.onRequest(async (request, response) => {
  const token = await getToken();
  const path = `https://api.igdb.com/v4/games?search=${encodeURIComponent(request.query.search)}&fields=name,platforms`;

  axios({
    url: path,
    method: 'POST',
    data: 'fields alternative_name,character,checksum,collection,company,description,game,name,platform,published_at,test_dummy,theme;',
    headers: {
      'Client-ID': functions.config().igdb.id,
      'Authorization': `Bearer ${token.access_token}`,
      'Accept': 'application/json',
    },
  })
  .then(function(r) {
    response.status(200).send(r.data);
  })
  .catch(function(e) {
    response.status(500).send(e.message);
  });
});
