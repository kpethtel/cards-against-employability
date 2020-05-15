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
var playerCount = 0;
const SELECTED_ANSWERS = [];
const votes = {};

connectDb();

app.get('/', function(req, res){
  res.send({ response: 'Server running' }).status(200);
});

io.on('connection', function(socket){
  playerCount++;
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('start round', function(){
    dealQuestion();
  })

  socket.on('player enters', function(player){
    io.emit('announce player entry', `${player} is seeking employment`);
  });

  socket.on('select answer', function(message){
    SELECTED_ANSWERS.push(message);
    if (SELECTED_ANSWERS.length === playerCount) {
      io.emit('vote on selected', SELECTED_ANSWERS)
    }
  });

  socket.on('cast vote', function(message){
    votes[message] ? votes[message]++ : votes[message] = 1
    if (votes.length != playerCount) return
    // needs handling for ties
    const winner = votes.reduce((previous, current) => (current[1] >= previous[1] ? current : previous))[0];
    io.emit('announce winner', winner.key);

    // if (type === 'gif') {
    //   io.emit('announce winner', winner.key);
    // } else if (type === 'q&a') {
    //   const answer = models.Answer.findById(mongoose.Types.ObjectId(message));
    //   answer.then((doc) => {
    //     io.emit('announce winner', doc.text);
    //   }).catch((err) => {
    //     console.log(err);
    //   });
    // } else {
    //   console.log('not implemented yet');
    // }
  })

  socket.on('disconnect',function(){
    playerCount--;
    console.log('user disconnected');
  });
});

server.listen(3001, function(){
  console.log('listening on *:3001');
});