import React from "react";
import PropTypes from 'prop-types';
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

Answer.propTypes = {
  text: PropTypes.string,
  id: PropTypes.string,
  onSelect: PropTypes.func,
}

export default Answer;