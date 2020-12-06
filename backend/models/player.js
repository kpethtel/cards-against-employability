class Player {

  constructor(playerSocket) {
    this.playerSocket = playerSocket;
    this.socket = this.playerSocket.socket;
    this.name = null;
    this.active = false;
  }
}

export default Player;