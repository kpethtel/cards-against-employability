import React, { useEffect, useState } from "react";
import { socket } from "../../utils/socket/socket.js";
import Question from '../question/question.js';
import Answer from "../answer/answer.js";
import GifAnswersSection from "../gif_answers_section/gif_answers_section.js";

import './board.css';

const Board = () => {
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [winner, setWinner] = useState('');
  useEffect(() => {
    socket.on('deal question', data => setQuestion(data[0]));
    socket.on('deal answers', data => setAnswers(
      [data[0], data[0], data[0], data[0], data[0], data[0], data[0], data[0], data[0], data[0], data[0], data[0]]
    ));
    socket.on('announce winner', data => setWinner(data))
  }, []);

  const selectAnswer = (type, message) => {
    socket.emit('select answer', type, message);
  }

  const renderQuestion = () => {
    if (question.text) {
      return <Question
        text={question.text}
      />
    }
  }

  const renderAnswersSection = () => {
    if (answers.length > 0) {
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
      return <div className="answersSection">
        {answersSection}
      </div>
    }
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

  const renderWinner = () => {
    let winnerCard;
    switch (question.type) {
      case 'q&a':
        winnerCard = <span>{winner}</span>
        break;
      case 'gif':
        winnerCard = <img src={winner} alt="winner" />
        break;
      default:
        break;
    }
    return (
      <div className="winner">
        We have a winner
        {winnerCard}
      </div>
    )
  }

  return (
    <div className="board">
      {winner ? (
        renderWinner()
      ) : (
        <div className="activeRound">
          { renderQuestion() }
          { renderAnswersSection() }
        </div>
      )}
    </div>
  );
}

export default Board;