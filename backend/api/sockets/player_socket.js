class PlayerSocket {

  constructor(socket, gameCallbacks) {
    this.socket = socket;
    this.game = gameCallbacks;
    this.addListeners();
  }

  addListeners() {
    this.handleChatMessage();
    this.handleNewPlayer();
    this.handleStartRound();
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

  handleStartRound() {
    this.socket.on('start round', () => {
      this.game.startRound();
    });
  }

  handleAnswerSelection() {
    this.socket.on('select answer', (type, message) => {
      this.game.addSelectedAnswer(message);
    });
  }

  handleIncomingVote() {
    this.socket.on('cast vote', (voteType, incomingVote) => {
      this.game.processVote(voteType, incomingVote)
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