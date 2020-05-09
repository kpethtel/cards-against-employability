import React from "react";
import './answer.css';

const Answer = ({text, id, onSelect}) => {
  return (
    <div
      className="answer"
      onClick={() => onSelect('q&a', id)}>
      {text}
    </div>
  );
}

export default Answer;