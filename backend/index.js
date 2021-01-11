import express from 'express';
import http from 'http';
import ioClient from 'socket.io';
import cors from 'cors';
import connectDb from './config/connect_db.js';
import GameRoom from './services/game_room.js';

const app = express();
const server = http.createServer(app);
const io = ioClient(server);

connectDb();

const corsOptions = {
  origin: 'http://localhost:3000'
}
app.use(cors(corsOptions));
app.use(express.json());

// adding default game for ease of development, should be removed later
const games = [new GameRoom('default', io)];

function findGame(name) {
  return games.find(game => game.name === name);
}

app.get('/', function(req, res){
  res.send({ response: 'Server running' }).status(200);
});

app.post('/games/new', (req, res) => {
  const game = new GameRoom(req.body.name, io);
  games.push(game);
  res.send({ response: 'ok' }).status(201);
});

io.on('connection', function(socket){
  let gameName = socket.handshake.query['gameName']
  const gameRoom = findGame(gameName);
  console.log(`Socket ${socket.id} connected.`);
  gameRoom.addPlayer(socket);
});

server.listen(3001, function(){
  console.log('listening on *:3001');
});