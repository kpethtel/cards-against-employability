import React, { useState } from "react";
import Chat from "../chat/chat.js";
import Board from "../board/board.js";
import TextForm from "../text_form/text_form.js";
import './App.css';

const App = () => {

  const [playerName, setPlayerName] = useState("");

  const handleNameSetting = (name) => {
    setPlayerName(name);
  }

  const needsName = playerName === "";

  const renderNamePrompt = () => {
    const prompt = 'Give yourself a name'
    return <TextForm prompt={prompt} callback={handleNameSetting} />
  };

  const renderBoard = () => {
    return <Board />
  }

  const renderChat = () => {
    return <Chat playerName={playerName} />
  }

  return (
    <div className="app">
      {needsName ? (
        renderNamePrompt()
      ) : (
        <div className="game">
          {renderBoard()}
          {renderChat()}
        </div>
      )}
    </div>
  );
}

export default App;