import express from 'express';
import http from 'http';
import ioClient from 'socket.io';
import mongoose from 'mongoose';
import connectDb from './config/connect_db.js';
import models from './models/index.js';
import dealQuestion from './services/deal_question.js';

const app = express();
const server = http.createServer(app);
export const io = ioClient(server);

const ROOM = 'game';
var selectedAnswers = [];
var votes = {};
var players = {};
var currentPhase = null;

connectDb();

app.get('/', function(req, res){
  res.send({ response: 'Server running' }).status(200);
});

io.on('connection', function(socket){
  console.log(`Socket ${socket.id} connected.`);

  socket.on('chat message', function(playerName, message){
    io.sockets.in(ROOM).emit('chat message', playerName, message);
  });

  socket.on('start round', function(){
    currentPhase = 'selecting answers';
    // for (const player in players) {
      // player.status = 'active';
    // }
    dealQuestion(question => io.in(ROOM).emit('deal question', currentPhase, question));
  });

  socket.on('player enters', function(player){
    socket.join(ROOM);
    players[socket.id] = {name: player, status: 'inactive'};
    console.log('players', players)
    io.sockets.in(ROOM).emit('announce player entry', `${player} is seeking employment`);
  });

  socket.on('select answer', function(type, message){
    selectedAnswers.push(message);
    const playerCount = Object.keys(players).length;
    if (selectedAnswers.length === playerCount) {
      currentPhase = 'vote';
      io.sockets.in(ROOM).emit('vote on selected', currentPhase, selectedAnswers);
      selectedAnswers = [];
    }
  });

  socket.on('cast vote', function(type, incomingVote){
    let vote;
    switch (type) {
      case 'gif':
        vote = incomingVote;
        break;
      case 'q&a':
        const answer = models.Answer.findById(mongoose.Types.ObjectId(incomingVote));
        answer.then((doc) => {
          vote = doc.text
        }).catch((err) => {
          console.log(err);
        });
        break;
      default:
        console.log('not implemented yet');
        break;
    }

    votes[vote] ? votes[vote]++ : votes[vote] = 1
    console.log('votes: ', votes)

    const voteTallies = Object.values(votes);
    const voteCount = voteTallies.reduce((acc, value) => acc += value , 0);
    const playerCount = Object.keys(players).length;
    if (voteCount != playerCount) return

    const maxVotes = Math.max(...voteTallies);
    const winners = Object.keys(votes).filter(key => votes[key] === maxVotes);
    currentPhase = 'show winners';
    io.sockets.in(ROOM).emit('announce winners', currentPhase, winners);
    votes = {};
  })

  socket.on('disconnect', function(){
    delete players[socket.id];
    socket.leave(ROOM);
    console.log('players', players)
    console.log(`Socket ${socket.id} disconnected.`);
  });
});

server.listen(3001, function(){
  console.log('listening on *:3001');
});