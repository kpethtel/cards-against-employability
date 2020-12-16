import React, { useState } from "react";
import Chat from "../chat/chat.js";
import Board from "../board/board.js";
import TextForm from "../text_form/text_form.js";
import { socket } from "../../utils/socket/socket.js";
import './App.css';

const App = () => {

  const [playerSocket, setPlayerSocket] = useState(null);
  const [playerName, setPlayerName] = useState("");

  const handleGameSetting = (gameName) => {
    const newSocket = socket(gameName);
    setPlayerSocket(newSocket);
  }

  const handleNameSetting = (name) => {
    setPlayerName(name);
    playerSocket.emit('player enters', name);
  }

  const needsName = playerName === "";

  const renderCurrentBoardState = () => {
    if (playerSocket === null) {
      return renderGameNamePrompt();
    } else if (needsName) {
      return renderNamePrompt();
    } else {
      return (
        <div className="game">
          {renderBoard()}
          {renderChat()}
        </div>
      )
    }
  }

  const renderGameNamePrompt = () => {
    const prompt = 'Which game are you joining?'
    return <TextForm prompt={prompt} callback={handleGameSetting} />
  }

  const renderNamePrompt = () => {
    const prompt = 'Give yourself a name'
    return <TextForm prompt={prompt} callback={handleNameSetting} />
  };

  const renderBoard = () => {
    return <Board socket={playerSocket} />
  }

  const renderChat = () => {
    return <Chat socket={playerSocket} playerName={playerName} />
  }

  return (
    <div className="app">
      {renderCurrentBoardState()}
    </div>
  );
}

export default App;