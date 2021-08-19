const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp({
  storageBucket: 'gamera-dev.appspot.com',
});

const igdb = require('./igdb').functions(admin, functions);
const search = require('./search').functions(admin, functions);

exports.fetchGames = igdb.fetchGames;
exports.fetchPlatforms = igdb.fetchPlatforms;
exports.searchGames = search.searchGames;
exports.generateSearchDocuments = search.generateSearchDocuments;
