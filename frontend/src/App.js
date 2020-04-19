import React, { useState } from "react";
import Chat from "./chat/chat.js"
import Board from "./board/board.js"
import NamePrompt from "./name_prompt/name_prompt.js"
import './App.css';

const App = () => {

  const [playerName, setPlayerName] = useState("");

  const handleNameSetting = (name) => {
    setPlayerName(name);
  }

  const displaySubcomponent = () => {
    if (playerName === "") {
      return <NamePrompt handleNameSetting={handleNameSetting} />
    } else {
      return (
        <div>
          <Board />
          <Chat playerName={playerName} />
        </div>
      )
    }
  }

  return (
    <div className="app">
      { displaySubcomponent() }
    </div>
  );
}

export default App;