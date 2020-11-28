import mongoose from 'mongoose';
import models from '../models/index.js';
import dealQuestion from './deal_question.js';
import PlayerSocket from '../api/sockets/player_socket.js';

class GameRoom {

  constructor(io) {
    this.io = io;
    this.roomName = 'game';
    this.room = this.io.sockets.in(this.roomName)
    this.selectedAnswers = [];
    this.votes = {};
    this.players = {};
    this.currentPhase = null;
    this.setterCallbacks = {
      addPlayerName: this.addPlayerName,
      addSelectedAnswer: this.addSelectedAnswer,
      processVote: this.processVote,
      removePlayer: this.removePlayer,
      sendChatMessage: this.sendChatMessage,
      startRound: this.startRound,
    }
  }

  addPlayer(socket) {
    const player = new PlayerSocket(socket, this.setterCallbacks);
    this.players[player.socket.id] = {status: 'inactive'};
  }

  getVoteData(voteType, incomingVote) {
    switch (voteType) {
      case 'gif':
        return incomingVote;
      case 'q&a':
        const voteId = mongoose.Types.ObjectId(incomingVote)
        const answer = models.Answer.findById(voteId);
        answer.then((doc) => {
          return doc.text
        }).catch((err) => {
          console.log(err);
          return
        });
      default:
        console.log(`${voteType} not implemented`);
        return
    }
  }

  tallyVote(vote) {
    return this.votes[vote] ? this.votes[vote]++ : this.votes[vote] = 1;
  }

  playerCount() {
    return Object.keys(this.players).length;
  }

  allVotesReceived(voteTallies) {
    const voteCount = voteTallies.reduce((acc, value) => acc += value , 0);
    return voteCount === this.playerCount();
  }

  findWinners(voteTallies) {
    const maxVotes = Math.max(...voteTallies);
    const voteKeys = Object.keys(this.votes)
    return voteKeys.filter(key => this.votes[key] === maxVotes);
  }

  showWinners(voteTallies) {
    const winners = this.findWinners(voteTallies);
    this.currentPhase = 'show winners';
    this.room.emit('announce winners', this.currentPhase, winners);
    this.votes = {};
  }

  transitionToVoting() {
    this.currentPhase = 'vote';
    this.room.emit('vote on selected', this.currentPhase, this.selectedAnswers);
    this.selectedAnswers = [];
  }

  addPlayerName = (socket, name) => {
    socket.join(this.roomName);
    this.players[socket.id]['name'] = name;
    console.log('players', this.players);
    this.room.emit('announce player entry', `${name} is seeking employment`);
  }

  startRound = () => {
    console.log('starting round');
    this.currentPhase = 'selecting answers';
    dealQuestion(question => {
      this.room.emit('deal question', this.currentPhase, question);
    });
  }

  addSelectedAnswer = (answer) => {
    this.selectedAnswers.push(answer);
    if (this.selectedAnswers.length === this.playerCount()) {
      this.transitionToVoting();
    }
  }

  processVote = (voteType, incomingVote) => {
    const vote = this.getVoteData(voteType, incomingVote);
    this.tallyVote(vote);

    const voteTallies = Object.values(this.votes);
    if (!this.allVotesReceived(voteTallies)) return;

    this.showWinners(voteTallies);
  }

  removePlayer = (socket) => {
    delete this.players[socket.id];
    this.socket.leave(this.roomName);
    console.log('players', this.players);
  }

  sendChatMessage = (playerName, message) => {
    this.room.emit('chat message', playerName, message);
  }
};

export default GameRoom;