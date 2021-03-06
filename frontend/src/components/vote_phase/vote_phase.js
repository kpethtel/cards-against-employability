import React from "react";
import PropTypes from 'prop-types';
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
              src={candidate.answer}
              alt="vote"
              onClick={() => onSelect('gif', candidate.id)}
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

Vote.propTypes = {
  question: PropTypes.object,
  candidates: PropTypes.array,
  onSelect: PropTypes.func,
}

export default Vote;