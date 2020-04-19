import React from "react";

const Question = ({text, id}) => {
  return (
    <div className="question">
      <p>{text}</p>
    </div>
  );
}

export default Question;