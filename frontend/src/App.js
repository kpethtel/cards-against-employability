import React, { useEffect, useState } from "react";
import Chat from "./chat/chat.js"
import Board from "./board/board.js"
import NamePrompt from "./name_prompt/name_prompt.js"
import './App.css';

const App = () => {

  // not sure yet if this will be needed
  const [playerName, setPlayerName] = useState("");

  const handleNameSetting = (name) => {
    setPlayerName(name);
  }

  const displaySubcomponent = () => {
    if (playerName === "") {
      return <NamePrompt
        handleNameSetting={handleNameSetting}
      />
    } else {
      return <Chat playerName={playerName} />
    }
  }

  return (
    <div class="app">
      { displaySubcomponent() }
    </div>
  );
}

export default App;