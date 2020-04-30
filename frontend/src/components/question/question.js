import React from "react";
import './question.css'

const Question = ({text}) => {
  return (
    <div className="question">
      {text}
    </div>
  );
}

export default Question;