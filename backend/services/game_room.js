import fetchQuestion from './fetch_question.js';
import Player from '../models/player.js';
import PlayerSocket from '../api/sockets/player_socket.js';
import PhaseMachine from './phase_machine.js';

class GameRoom {

  constructor(name, io) {
    this.name = name;
    this.io = io;
    this.roomName = 'game';
    this.room = this.io.sockets.in(this.roomName)
    this.socketCallbacks = {
      addPlayerName: this.addPlayerName,
      addSelectedAnswer: this.addSelectedAnswer,
      processVote: this.processVote,
      removePlayer: this.removePlayer,
      sendChatMessage: this.sendChatMessage,
      startGame: this.startGame,
    }
    this.initializeGameData();
  }

  initializeGameData() {
    this.selectedAnswers = [];
    this.players = [];
    this.seenQuestions = [];
    this.phase = new PhaseMachine(
      this.startRound,
      this.startVoting,
      this.showResults
    );
  }

  addPlayer(socket) {
    const playerSocket = new PlayerSocket(socket, this.socketCallbacks);
    const player = new Player(playerSocket);
    this.players.push(player);
  }

  playerCount() {
    return this.players.length;
  }

  // could be replaced with a counter
  voteCount() {
    return this.selectedAnswers.reduce((acc, answer) => acc += answer.votes, 0);
  }

  allVotesReceived() {
    return this.voteCount() === this.playerCount();
  }

  findWinners() {
    let mostVotes = 0;
    this.selectedAnswers.forEach(answer => {
      if (answer.votes > mostVotes) mostVotes = answer.votes;
    });
    return this.selectedAnswers.filter(answer => answer.votes === mostVotes);
  }

  async dealQuestion() {
    let question = await fetchQuestion(this.seenQuestions);
    if (!question) {
      this.seenQuestions = [];
      question = await fetchQuestion(this.seenQuestions);
    }
    if (question) {
      this.seenQuestions.push(question._id);
      this.room.emit('deal question', this.phase.name(), this.phase.time(), question);
    } else {
      console.log('ERROR: no question received')
    }
  }

  findPlayerBySocketId(socketId) {
    return this.players.find(player => player.socket.id === socketId);
  }

  findAnswerById(id) {
    return this.selectedAnswers.find(answer => answer.id === id)
  }

  showResults = () => {
    console.log('SHOWING WINNERS')
    if (this.voteCount === 0) return

    const winners = this.findWinners();
    this.phase.increment();
    winners.forEach(winner => {
      const player = this.findPlayerBySocketId(winner.id);
      winner['userName'] = player.name;
    });
    this.room.emit('announce winners', this.phase.name(), winners);
    this.selectedAnswers = [];
  }

  startVoting = () => {
    if (this.selectedAnswers.length === 0) return

    console.log('START VOTING')
    this.phase.increment();
    this.room.emit('vote on selected', this.phase.name(), this.phase.time(), this.selectedAnswers);
  }

  addPlayerName = (socket, name) => {
    // this should probably be done when the player enters the room
    // once the 'active' functionality is in place
    socket.join(this.roomName);
    const player = this.findPlayerBySocketId(socket.id);
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

  addSelectedAnswer = (socketId, answer) => {
    this.selectedAnswers.push({id: socketId, answer: answer, votes: 0});
    if (this.selectedAnswers.length === this.playerCount() || this.phase.timedOut()) {
      this.startVoting();
    }
  }

  processVote = (answerId) => {
    const answer = this.findAnswerById(answerId);
    answer.votes++;
    if (this.allVotesReceived() || this.phase.timedOut()) this.showResults();
  }

  removePlayer = (socket) => {
    const exitingPlayer = this.findPlayerBySocketId(socket.id);
    this.players = this.players.filter(player => player !== exitingPlayer)
    if (this.players.length === 0) {
      this.phase.cancelTimer();
      this.initializeGameData();
    }
    socket.leave(this.roomName);
    console.log('players', this.players);
  }

  sendChatMessage = (playerName, message) => {
    this.room.emit('chat message', playerName, message);
  }
};

export default GameRoom;