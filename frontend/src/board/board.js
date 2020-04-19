import React, { useEffect, useState } from "react";
import { socket } from "../socket/socket.js";

const Board = () => {
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  useEffect(() => {
    socket.on('deal question', data => setQuestion(data[0]));
    socket.on('deal answers', data => setAnswers([data[0]]));
  }, []);

  return (
    <div class="board">
      <p>{question && question.text}</p>
      <p>{answers && answers[0] && answers[0].text}</p>
    </div>
  );
}

export default Board;