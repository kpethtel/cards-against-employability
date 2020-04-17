var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.send({ response: "Server running" }).status(200);
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('player enters', function(player){
    io.emit('announce player entry', `${player} is seeking employment`);
  });
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});