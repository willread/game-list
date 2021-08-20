const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp({
  storageBucket: 'gamera-dev.appspot.com',
});

const igdb = require('./igdb').functions(admin, functions);

exports.fetchGames = igdb.fetchGames;
exports.fetchPlatforms = igdb.fetchPlatforms;

exports.search = require('./search')(admin, functions);
exports.lists = require('./lists')(admin, functions);
