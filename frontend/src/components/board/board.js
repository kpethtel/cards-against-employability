import React, { useEffect, useState } from "react";
import { socket } from "../../utils/socket/socket.js";
import Question from '../question/question.js';
import Answer from "../answer/answer.js";
import GifAnswersSection from "../gif_answers_section/gif_answers_section.js";
import Winner from "../winner/winner.js";

import './board.css';

const Board = () => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [winner, setWinner] = useState('');
  useEffect(() => {
    socket.on('deal question', data => {
      setQuestion(data[0]);
      setWinner('');
    });
    socket.on('deal answers', data => setAnswers(
      [data[0], data[0], data[0], data[0], data[0], data[0], data[0], data[0], data[0], data[0], data[0], data[0]]
    ));
    socket.on('announce winner', data => setWinner(data))
  }, []);

  const selectAnswer = (type, message) => {
    socket.emit('select answer', type, message);
  }

  const nextRound = () => {
    socket.emit('start round');
  }

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

  const renderWinner = () => <Winner winner={winner} questionType={question.type} nextRound={nextRound}/>


  const renderWaitingRoom = () => {
    return <button label="start" onClick={nextRound}>Start</button>
  }

  const renderActiveRound = () => {
    return (
      <div className="activeRound">
        { renderQuestion() }
        { renderAnswersSection() }
      </div>
    )
  }

  const renderPhase = () => {
    if (question.length === 0) { return renderWaitingRoom() }
    if (winner.length === 0) { return renderActiveRound() }
    return renderWinner();
  }

  return (
    <div className="board">
      {renderPhase()}
    </div>
  );
}

export default Board;