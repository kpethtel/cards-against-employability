import React from "react";
import Question from "../question/question.js";

const Vote = ({question, candidates, onSelect}) => {
  const renderQuestion = () => {
    if (question.text) {
      return <Question
        text={question.text}
      />
    }
  }

  const renderCandidates = () => {
    return (
      <div className="candidates">
        {
          candidates.map(candidate => {
            return <img
              src={candidate}
              alt="vote"
              onClick={() => onSelect('gif', candidate)}
            />
          })
        }
      </div>
    )
  }

  return (
    <div className="vote">
      {renderQuestion()}
      <span>Pick the winner</span>
      {renderCandidates()}
    </div>
  );
}

export default Vote;