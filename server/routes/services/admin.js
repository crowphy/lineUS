var mongoose = require('mongoose');
var moment = require('moment');
var UserSchema = require('../../models/userSchema');

var UserModel = mongoose.model('User', UserSchema);
var Admin = {
  init: function (app) {
    app.get('/admin', this.getAllUsers);
    app.get('/admin/chat', this.talkToUser);
  },
  getAllUsers: function(req, res) {
    UserModel.find({}, function(err, data) {
      if(err) {
        console.log(err);
      } else {
        res.render('index', {title: '管理员'})
      }
    })
  },
  talkToUser: function(req, res) {
  	console.log('req:-', req._parsedOriginalUrl);
  	res.render('chat', {title: '管理员'});
  }

};

module.exports = Admin;