class Player {

  constructor(playerSocket) {
    this.playerSocket = playerSocket;
    this.socket = this.playerSocket.socket;
    this.name = null;
    this.status = 'incomplete';
  }

  addName = (name) => {
    this.name = name;
    this.status = 'waiting';
  }

  activate = () => {
    this.status = 'active';
  }
}

export default Player;