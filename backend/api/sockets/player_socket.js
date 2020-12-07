class PlayerSocket {

  constructor(socket, gameCallbacks) {
    this.socket = socket;
    this.game = gameCallbacks;
    this.addListeners();
  }

  addListeners() {
    this.handleChatMessage();
    this.handleNewPlayer();
    this.handleStartGame();
    this.handleAnswerSelection();
    this.handleIncomingVote();
  };

  handleChatMessage() {
    this.socket.on('chat message', (playerName, message) => {
      this.game.sendChatMessage(playerName, message);
    });
  }

  handleNewPlayer() {
    this.socket.on('player enters', (player) => {
      this.game.addPlayerName(this.socket, player);
    });
  }

  handleStartGame() {
    this.socket.on('start game', () => {
      this.game.startGame();
    });
  }

  handleAnswerSelection() {
    this.socket.on('select answer', (type, message) => {
      this.game.addSelectedAnswer(this.socket.id, message);
    });
  }

  handleIncomingVote() {
    this.socket.on('cast vote', (voteType, incomingVoteId) => {
      this.game.processVote(incomingVoteId)
    })
  }

  handlePlayerDisconnect() {
    this.socket.on('disconnect', () => {
      this.game.removeplayer(this.socket);
      console.log(`Socket ${this.socket.id} disconnected.`);
    });
  }
};

export default PlayerSocket;