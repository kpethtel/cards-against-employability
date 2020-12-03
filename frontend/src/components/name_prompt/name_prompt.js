import React, { useState } from "react";
import PropTypes from 'prop-types';
import { socket } from "../../utils/socket/socket.js";
import './name_prompt.css'

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
    <div className="name-prompt">
      <form onSubmit={handleSubmit}>
        <label>Give yourself a name</label>
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

NamePrompt.propTypes = {
  handleNameSetting: PropTypes.func,
}

export default NamePrompt;