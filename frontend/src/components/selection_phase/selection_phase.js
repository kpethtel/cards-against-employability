import React from "react";
import PropTypes from 'prop-types';
import Question from "../question/question.js";
import Answer from "../answer/answer.js";
import GifAnswersSection from "../gif_answers_section/gif_answers_section.js";

const SelectionPhase = ({question, answers, onSelect}) => {

  const renderQuestion = () => {
    if (question.text) return <Question text={question.text} />
  }

  const renderAnswersSection = () => {
    let answersSection;
    switch (question.type) {
      case 'q&a':
        answersSection = renderAnswerCards();
        break;
      case 'gif':
        answersSection = renderGifAnswersSection();
        break;
      default:
        break;
    }
    return (
      <div className="answersSection">
        {answersSection}
      </div>
    )
  }

  const renderGifAnswersSection = () => <GifAnswersSection onSelect={onSelect}/>

  const renderAnswerCards = () => {
    return answers.map((answer) => {
      return (
        <Answer
          text={answer.text}
          id={answer._id}
          onSelect={onSelect}
        />
      )
    });
  }

  return (
    <div className="activeRound">
      {renderQuestion()}
      {renderAnswersSection()}
    </div>
  )
}

SelectionPhase.propTypes = {
  question: PropTypes.string,
  answers: PropTypes.array,
  onSelect: PropTypes.func,
}

export default SelectionPhase;