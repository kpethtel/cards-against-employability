import React, { useState } from "react";
import Chat from "../chat/chat.js";
import Board from "../board/board.js";
import TextForm from "../text_form/text_form.js";
import { socket } from "../../utils/socket/socket.js";
import './App.css';

const Socket = socket();

const App = () => {
  const [playerName, setPlayerName] = useState("");
  const [gameEntry, setGameEntry] = useState({});

  const handleGameSetting = (gameName) => {
    Socket.emit('join game', gameName, (response) => {
      setGameEntry(response);
    });
  }

  const handleNameSetting = (name) => {
    setPlayerName(name);
    Socket.emit('player enters', name);
  }

  const needsGameName = gameEntry.status !== 'success'

  const gameEntryError = gameEntry.status === 'error'

  const needsName = playerName === '';

  const renderCurrentBoardState = () => {
    if (needsGameName) {
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
    const prompt = 'Which game are you joining?';
    return (
      <div>
        <TextForm prompt={prompt} callback={handleGameSetting} />
        {
          gameEntryError ? (<div className='error'><p>Invalid. Try again.</p></div>) : null
        }
      </div>
    )
  }

  const renderNamePrompt = () => {
    const prompt = 'Give yourself a name'
    return <TextForm prompt={prompt} callback={handleNameSetting} />
  };

  const renderBoard = () => {
    return <Board socket={Socket} />
  }

  const renderChat = () => {
    return <Chat socket={Socket} playerName={playerName} />
  }

  return (
    <div className="app">
      {renderCurrentBoardState()}
    </div>
  );
}

export default App;