import React, { useEffect, useState } from "react";
import { socket } from "../socket/socket.js";
import Question from '../question/question.js';
import Answer from "../answer/answer.js";

const Board = () => {
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  useEffect(() => {
    socket.on('deal question', data => setQuestion(data[0]));
    socket.on('deal answers', data => setAnswers([data[0]]));
  }, []);

  const renderQuestion = () => {
    if (question.text) {
      return <Question
        text={question.text}
        id={question._id}
      />
    }
  }

  const renderAnswers = () => {
    if (answers.length > 0) {
      return answers.map((answer) => {
        return <Answer
          text={answer.text}
          id={answer._id}
        />
      });
    }
  }

  return (
    <div className="board">
      { renderQuestion() }
      { renderAnswers() }
    </div>
  );
}

export default Board;