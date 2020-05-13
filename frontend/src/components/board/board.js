import React, { useEffect, useState } from "react";
import { socket } from "../../utils/socket/socket.js";
import Winner from "../winner/winner.js";
import WaitingRoom from '../phases/waiting_room/waiting_room.js';
import Selection from '../phases/selection/selection.js'

import './board.css';

const Board = () => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [winner, setWinner] = useState('');
  useEffect(() => {
    socket.on('deal question', data => {
      console.log('got question', data)
      setQuestion(data[0]);
      setWinner('');
    });
    socket.on('deal answers', data => setAnswers(
      [data[0], data[0], data[0], data[0], data[0], data[0], data[0], data[0], data[0], data[0], data[0], data[0]]
    ));
    socket.on('announce winner', data => setWinner(data))
  }, []);

  const nextRound = () => {
    socket.emit('start round');
  }

  const selectAnswer = (type, message) => {
    socket.emit('select answer', type, message);
  }

  const renderWinner = () => <Winner winner={winner} questionType={question.type} nextRound={nextRound}/>

  const renderPhase = () => {
    if (question.length === 0) {return <WaitingRoom nextRound={nextRound} />}
    if (winner.length === 0) {
      return <Selection question={question} answers={answers} selectAnswer={selectAnswer} />
    }
    return renderWinner();
  }

  return (
    <div className="board">
      {renderPhase()}
    </div>
  );
}

export default Board;