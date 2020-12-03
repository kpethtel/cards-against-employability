import React from "react";
import PropTypes from 'prop-types';
import './question.css'

const Question = ({text}) => {
  return (
    <div className="question">
      {text}
    </div>
  );
}

Question.propTypes = {
  text: PropTypes.string,
}

export default Question;