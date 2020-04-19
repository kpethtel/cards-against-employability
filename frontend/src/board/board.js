import React, { useEffect, useState } from "react";
import { socket } from "../socket/socket.js";

const Board = () => {
  const [question, setQuestion] = useState({});
  useEffect(() => {
    socket.on('deal question', data => setQuestion(data[0]));
  }, []);

  return (
    <div class="board">
      <p>{question && question.text}</p>
    </div>
  );
}

export default Board;