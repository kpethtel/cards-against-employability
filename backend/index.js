var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const mongoose = require('mongoose');
const objectId = mongoose.ObjectId
var fs = require('fs')
var dotenv = require('dotenv');
dotenv.config();

const db_uri = process.env.MONGODB_URI;
mongoose.connect(db_uri);

fs.readdirSync(__dirname + '/models').forEach(function(filename) {
  if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});

app.get('/', function(req, res){
  res.send({ response: "Server running" }).status(200);
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('player enters', function(player){
    io.emit('announce player entry', `${player} is seeking employment`);
    mongoose.model('questions').find({}, function(err, questions) {
      mongoose.model('questions').populate(questions, {path: 'questions'}, function(err, question) {
        io.emit('deal question', question);
      });
    }).limit(1);
    mongoose.model('answers').find({}, function(err, answers) {
      mongoose.model('answers').populate(answers, {path: 'answers'}, function(err, answer) {
        io.emit('deal answers', answer);
      });
    }).limit(1);
  });

  socket.on('select answer', function(answerId){
    const answer = mongoose.model('answers').findById(mongoose.Types.ObjectId(answerId));
    answer.then((doc)=>{
      io.emit('announce winner', doc);
    }).catch((err)=>{
      console.log(err);
    });
  });
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});