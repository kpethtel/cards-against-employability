import React from "react";
import './question.css'

const Question = ({text}) => {
  return (
    <div className="question">
      <p>{text}</p>
    </div>
  );
}

export default Question;