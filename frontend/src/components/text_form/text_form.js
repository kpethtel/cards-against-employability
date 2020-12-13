import React, { useState } from "react";
import PropTypes from 'prop-types';

const TextForm = ({ prompt, callback }) => {

  const [text, setText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    callback(text);
  }

  const handleChange = (event) => {
    var text = event.target.value;
    setText(text);
  }

  return (
    <div className="text-prompt">
      <form onSubmit={handleSubmit}>
        <label>{prompt}</label>
        <br/>
        <input
          name="text-input"
          type="text"
          onChange={handleChange}
          value={text}
        />
      </form>
    </div>
  );
}

TextForm.propTypes = {
  prompt: PropTypes.string,
  callback: PropTypes.func,
}

export default TextForm;