const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp({
  storageBucket: 'gamera-dev.appspot.com',
});

exports.igdb = require('./igdb')(admin, functions);
exports.search = require('./search')(admin, functions);
exports.lists = require('./lists')(admin, functions);
