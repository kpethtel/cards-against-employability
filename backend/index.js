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

connectDb();

app.get('/', function(req, res){
  res.send({ response: 'Server running' }).status(200);
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('start round', function(){
    dealQuestion();
  })

  socket.on('player enters', function(player){
    io.emit('announce player entry', `${player} is seeking employment`);
  });

  socket.on('select answer', function(type, message){
    if (type === 'gif') {
      io.emit('announce winner', message);
    } else if (type === 'q&a') {
      const answer = models.Answer.findById(mongoose.Types.ObjectId(message));
      answer.then((doc)=>{
        io.emit('announce winner', doc.text);
      }).catch((err)=>{
        console.log(err);
      });
    } else {
      console.log('not implemented yet');
    }
  });
});

server.listen(3001, function(){
  console.log('listening on *:3001');
});