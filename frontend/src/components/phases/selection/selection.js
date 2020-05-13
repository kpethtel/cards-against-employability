import React from "react";
import Question from "../../question/question.js";
import Answer from "../../answer/answer.js";
import GifAnswersSection from "../../gif_answers_section/gif_answers_section.js";

const Selection = ({question, answers, selectAnswer}) => {

  const renderQuestion = () => {
    if (question.text) {
      return <Question
        text={question.text}
      />
    }
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

  const renderGifAnswersSection = () => <GifAnswersSection onSelect={selectAnswer}/>

  const renderAnswerCards = () => {
    return answers.map((answer) => {
      return (
        <Answer
          text={answer.text}
          id={answer._id}
          onSelect={selectAnswer}
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

export default Selection;