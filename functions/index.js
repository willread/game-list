const igdb = require('./igdb');
const search = require('./search');

exports.fetchGames = igdb.fetchGames;
exports.fetchPlatforms = igdb.fetchPlatforms;
exports.searchGames = search.searchGames;
