import React, { useState } from "react";
import { createGame } from '../../actions/create_game';

const NewGame = () => {
  const [name, setName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    createGame(name);
  }

  const handleChange = (event) => {
    var text = event.target.value;
    setName(text);
  }

  return (
    <div className="gameName">
      <form onSubmit={handleSubmit}>
        <label>Give your game a catchy name</label>
        <br/>
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

export default NewGame;