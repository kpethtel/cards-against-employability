import React from "react";
import './answer.css';

const Answer = ({text, id, onSelect}) => {
  return (
    <div className="answer">
      <p>{text}</p>
      <div
        className="selector"
        onClick={() => onSelect(id)}>
        pick me
      </div>
    </div>
  );
}

export default Answer;