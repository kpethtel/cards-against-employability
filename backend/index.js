import express from 'express';
import http from 'http';
import ioClient from 'socket.io';
import connectDb from './config/connect_db.js';
import gameRoom from './api/sockets/game_room.js';

const app = express();
const server = http.createServer(app);
const io = ioClient(server);

connectDb();

app.get('/', function(req, res){
  res.send({ response: 'Server running' }).status(200);
});

io.on('connection', function(socket){
  console.log(`Socket ${socket.id} connected.`);
  gameRoom(io, socket);
});

server.listen(3001, function(){
  console.log('listening on *:3001');
});