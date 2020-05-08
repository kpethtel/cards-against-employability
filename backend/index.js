import express from 'express';
import http from 'http';
import ioClient from 'socket.io';
import mongoose from 'mongoose';
import connectDb from './config/connect_db.js';
import models from './models/index.js';

const app = express();
const server = http.createServer(app);
const io = ioClient(server);

connectDb();

app.get('/', function(req, res){
  res.send({ response: "Server running" }).status(200);
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('player enters', function(player){
    io.emit('announce player entry', `${player} is seeking employment`);
    models.Question.find({}, function(err, questions) {
      models.Question.populate(questions, {path: 'questions'}, function(err, question) {
        console.log(question);
        io.emit('deal question', question);
      });
    }).limit(1);
    models.Answer.find({}, function(err, answers) {
      models.Answer.populate(answers, {path: 'answers'}, function(err, answer) {
        console.log(answer)
        io.emit('deal answers', answer);
      });
    }).limit(1);
  });

  socket.on('select answer', function(answerId){
    const answer = models.Answer.findById(mongoose.Types.ObjectId(answerId));
    answer.then((doc)=>{
      io.emit('announce winner', doc);
    }).catch((err)=>{
      console.log(err);
    });
  });
});

server.listen(3001, function(){
  console.log('listening on *:3001');
});