import express from 'express';
import http from 'http';
import ioClient from 'socket.io';
import connectDb from './config/connect_db.js';
import GameRoom from './services/game_room.js';

const app = express();
const server = http.createServer(app);
const io = ioClient(server);

connectDb();

const gameRoom = new GameRoom(io);

app.get('/', function(req, res){
  res.send({ response: 'Server running' }).status(200);
});

io.on('connection', function(socket){
  console.log(`Socket ${socket.id} connected.`);
  gameRoom.addPlayer(socket);
});

server.listen(3001, function(){
  console.log('listening on *:3001');
});