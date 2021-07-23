const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

const igdb = require('./igdb');
const search = require('./search');

exports.fetchGames = igdb.fetchGames;
exports.fetchPlatforms = igdb.fetchPlatforms;
exports.searchGames = search.searchGames;
