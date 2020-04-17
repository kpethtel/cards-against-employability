import React, { useState } from "react";
import { socket } from "../socket/socket.js";

const NamePrompt = ({ handleNameSetting }) => {

  const [name, setName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    handleNameSetting(name);
    socket.emit('player enters', name);
  }

  const handleChange = (event) => {
    var text = event.target.value;
    setName(text);
  }

  return (
    <div class="name-prompt">
      <form onSubmit={handleSubmit}>
        <label>Give yourself a name</label>
        <input
          name="name"
          type="text"
          onChange={handleChange}
          value={name}
        />
      </form>
    </div>
  );
}

export default NamePrompt;