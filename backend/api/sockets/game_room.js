import mongoose from 'mongoose';
import models from '../../models/index.js';
import dealQuestion from '../../services/deal_question.js';

const ROOM = 'game';
let selectedAnswers = [];
let votes = {};
let players = {};
let currentPhase = null;

function getVoteData(incomingVote, voteType) {
  switch (voteType) {
    case 'gif':
      return incomingVote;
    case 'q&a':
      const answer = models.Answer.findById(mongoose.Types.ObjectId(incomingVote));
      answer.then((doc) => {
        return doc.text
      }).catch((err) => {
        console.log(err);
        return
      });
    default:
      console.log('not implemented yet');
      return
  }
}

function tallyVote(vote) {
  votes[vote] ? votes[vote]++ : votes[vote] = 1;
}

function playerCount() {
  return Object.keys(players).length;
}

function allVotesReceived(voteTallies) {
  const voteCount = voteTallies.reduce((acc, value) => acc += value , 0);
  return voteCount === playerCount();
}

function calculateWinners(voteTallies) {
  const maxVotes = Math.max(...voteTallies);
  return Object.keys(votes).filter(key => votes[key] === maxVotes);
}

const gameRoom = (io, socket) => {
  socket.on('chat message', function(playerName, message){
    io.sockets.in(ROOM).emit('chat message', playerName, message);
  });

  socket.on('player enters', function(player){
    socket.join(ROOM);
    players[socket.id] = {name: player, status: 'inactive'};
    console.log('players', players);
    io.sockets.in(ROOM).emit('announce player entry', `${player} is seeking employment`);
  });

  socket.on('start round', function(){
    console.log('server starting round');
    currentPhase = 'selecting answers';
    // for (const player in players) {
      // player.status = 'active';
    // }
    dealQuestion(question => io.in(ROOM).emit('deal question', currentPhase, question));
  });

  socket.on('select answer', function(type, message){
    selectedAnswers.push(message);
    if (selectedAnswers.length === playerCount()) {
      currentPhase = 'vote';
      io.sockets.in(ROOM).emit('vote on selected', currentPhase, selectedAnswers);
      selectedAnswers = [];
    }
  });

  socket.on('cast vote', function(voteType, incomingVote){
    const vote = getVoteData(incomingVote, voteType);
    tallyVote(vote);

    const voteTallies = Object.values(votes);
    if (!allVotesReceived(voteTallies)) return;

    const winners = calculateWinners(voteTallies);
    currentPhase = 'show winners';
    io.sockets.in(ROOM).emit('announce winners', currentPhase, winners);
    votes = {};
  })

  socket.on('disconnect', function(){
    delete players[socket.id];
    socket.leave(ROOM);
    console.log('players', players);
    console.log(`Socket ${socket.id} disconnected.`);
  });
};

export default gameRoom;