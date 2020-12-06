import mongoose from 'mongoose';
import models from '../models/index.js';
import fetchQuestion from './fetch_question.js';
import Player from '../models/player.js';
import PlayerSocket from '../api/sockets/player_socket.js';
import PhaseMachine from './phase_machine.js';

class GameRoom {

  constructor(io) {
    this.io = io;
    this.roomName = 'game';
    this.room = this.io.sockets.in(this.roomName)
    this.selectedAnswers = [];
    this.votes = {};
    this.players = [];
    this.phase = new PhaseMachine(
      this.startRound,
      this.startVoting,
      this.showResults
    );
    this.socketCallbacks = {
      addPlayerName: this.addPlayerName,
      addSelectedAnswer: this.addSelectedAnswer,
      processVote: this.processVote,
      removePlayer: this.removePlayer,
      sendChatMessage: this.sendChatMessage,
      startGame: this.startGame,
    }
  }

  addPlayer(socket) {
    const playerSocket = new PlayerSocket(socket, this.socketCallbacks);
    const player = new Player(playerSocket);
    this.players.push(player);
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
    this.votes[vote] ? this.votes[vote]++ : this.votes[vote] = 1;
  }

  playerCount() {
    return this.players.length;
  }

  allVotesReceived() {
    const voteCount = this.voteTallies().reduce((acc, value) => acc += value , 0);
    return voteCount === this.playerCount();
  }

  findWinners() {
    console.log('vote tallies', this.voteTallies())
    const maxVotes = Math.max(...this.voteTallies());
    const voteKeys = Object.keys(this.votes);
    return voteKeys.filter(key => this.votes[key] === maxVotes);
  }

  dealQuestion() {
    fetchQuestion(question => {
      console.log('DEALING QUESTIONS PHASE: ', this.phase.name())
      this.room.emit('deal question', this.phase.name(), question);
    });
  }

  voteTallies() {
    return Object.values(this.votes);
  }

  findPlayerBySocket(socket) {
    return this.players.find(player => player.socket.id === socket.id);
  }

  showResults = () => {
    console.log('SHOWING WINNERS')
    if (this.voteTallies().length === 0) return

    const winners = this.findWinners();
    this.phase.increment();
    this.room.emit('announce winners', this.phase.name(), winners);
    this.votes = {};
  }

  startVoting = () => {
    if (this.selectedAnswers.length === 0) return

    console.log('START VOTING')
    this.phase.increment();
    this.room.emit('vote on selected', this.phase.name(), this.selectedAnswers);
    this.selectedAnswers = [];
  }

  addPlayerName = (socket, name) => {
    // this should probably be done when the player enters the room
    // once the 'active' functionality is in place
    socket.join(this.roomName);
    const player = this.findPlayerBySocket(socket);
    player.name = name;
    console.log('players', this.players);
    this.room.emit('announce player entry', `${name} is seeking employment`);
  }

  startRound = () => {
    console.log('START ROUND');
    this.phase.increment();
    this.dealQuestion();
  }

  startGame = () => {
    console.log('START GAME');
    this.phase.start();
    this.dealQuestion();
  }

  addSelectedAnswer = (answer) => {
    this.selectedAnswers.push(answer);
    if (this.selectedAnswers.length === this.playerCount() || this.phase.timedOut()) {
      this.startVoting();
    }
  }

  processVote = (voteType, incomingVote) => {
    const vote = this.getVoteData(voteType, incomingVote);
    this.tallyVote(vote);
    if (this.allVotesReceived() || this.phase.timedOut()) this.showResults();
  }

  removePlayer = (socket) => {
    const exitingPlayer = this.findPlayerBySocket(socket);
    this.players = this.players.filter(player => player !== exitingPlayer)
    delete exitingPlayer
    socket.leave(this.roomName);
    console.log('players', this.players);
  }

  sendChatMessage = (playerName, message) => {
    this.room.emit('chat message', playerName, message);
  }
};

export default GameRoom;