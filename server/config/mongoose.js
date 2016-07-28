var mongoose = require('mongoose');
var config = require('./config.js');

module.exports = function() {
    var db = mongoose.connect(config.mongodb);
    mongoose.set('debug', true);
    console.log('connect to lineus success!');
    require('../models/userSchema.js');
    return db;
}