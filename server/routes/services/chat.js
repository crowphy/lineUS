'use strict';
var server = require('../../app');
var io = require('socket.io').listen(server, {
  'serverClient': false,
  'transports': ['websocket']
});

io.of('/chat').on('connection', function(socket) {

  socket.on('postMsg', function(news) {
    console.log(news);
    //users[news.to] = socket;
    console.log(news.to);
    socket.broadcast.emit(news.to, news);
    //socket.broadcast.emit('newMsg', news);
  });

  socket.on('img', function(imgData, color) {
    socket.broadcast.emit('newImg', socket.nickname, imgData, color);
  });

  socket.on('disconnect', function() {
    //users.splice(socket.userIndex, 1);
  });
});