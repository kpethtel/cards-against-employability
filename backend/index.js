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

// it would be better to count open connections but there is/was a bug around that in socket.io
// this approach is likely inadequate and will need to be improved
var playerCount = 0;
var selected_answers = [];
var votes = {};

connectDb();

app.get('/', function(req, res){
  res.send({ response: 'Server running' }).status(200);
});

io.on('connection', function(socket){

  playerCount++;
  console.log('player count', playerCount)

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('start round', function(){
    console.log(`Socket ${socket.id} connected.`);
    dealQuestion();
  })

  socket.on('player enters', function(player){
    io.emit('announce player entry', `${player} is seeking employment`);
  });

  socket.on('select answer', function(type, message){
    selected_answers.push(message);
    if (selected_answers.length === playerCount) {
      io.emit('vote on selected', selected_answers);
      selected_answers = [];
    }
  });

  socket.on('cast vote', function(type, incomingVote){
    let vote;
    if (type === 'gif') {
      vote = incomingVote;
    } else if (type === 'q&a') {
      const answer = models.Answer.findById(mongoose.Types.ObjectId(incomingVote));
      answer.then((doc) => {
        vote = doc.text
      }).catch((err) => {
        console.log(err);
      });
    } else {
      console.log('not implemented yet');
    }

    console.log('votes: ', votes)
    votes[vote] ? votes[vote]++ : votes[vote] = 1
    const voteTotal = Object.keys(votes).length
    if (voteTotal != playerCount) return
    // needs handling for ties
    const maxVotes = Object.values(votes).reduce((a, b) => obj[a] > obj[b] ? a : b);
    const winner = Object.keys(votes).reduce((acc, k)=> {
      if (votes[k] === maxVotes) { acc.push(k) }
      return acc
    }, []);
    io.emit('announce winner', winner);
    votes = {};
  })

  socket.on('disconnect',function(){
    playerCount--;
    console.log('user disconnected');
  });
});

server.listen(3001, function(){
  console.log('listening on *:3001');
});