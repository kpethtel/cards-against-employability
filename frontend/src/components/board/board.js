import React, { useEffect, useState } from "react";
import { socket } from "../../utils/socket/socket.js";
import Question from '../question/question.js';
import Answer from "../answer/answer.js";

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
    socket.on('announce winner', data => setWinner(data.text))
  }, []);

  const selectAnswer = (id) => {
    socket.emit('select answer', id);
  }

  const renderQuestion = () => {
    if (question.text) {
      return <Question
        text={question.text}
      />
    }
  }

  const renderAnswers = () => {
    if (answers.length > 0) {
      return <div className="answersSection">
        {
          answers.map((answer) => {
            return <Answer
              text={answer.text}
              id={answer._id}
              onSelect={selectAnswer}
            />
          })
        }
      </div>
    }
  }

  const renderWinner = () => {
    return <p>{winner}</p>
  }

  return (
    <div className="board">
      {winner ? (
        renderWinner()
      ) : (
        <div className="activeRound">
          { renderQuestion() }
          { renderAnswers() }
        </div>
      )}
    </div>
  );
}

export default Board;