import React, { useEffect, useState } from "react";
import { socket } from "../../utils/socket/socket.js";
import Winner from "../winner/winner.js";
import WaitingRoom from '../phases/waiting_room/waiting_room.js';
import Selection from '../phases/selection/selection.js'
import Vote from '../phases/vote/vote.js'

import './board.css';

const Board = () => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [winner, setWinner] = useState('');
  const [phase, setPhase] = useState('waiting');
  useEffect(() => {
    socket.on('deal question', data => {
      setQuestion(data[0]);
      setPhase('activeRound');
      setWinner('');
    });
    socket.on('deal answers', data => {
      setAnswers(data);
      setPhase('selectAnswer');
    });
    socket.on('vote on selected', data => {
      setAnswers(data);
      setPhase('vote');
    });
    socket.on('announce winner', data => {
      setWinner(data);
      setPhase('showWinner');
    });
  }, []);

  const nextRound = () => {
    socket.emit('start round');
  }

  const selectAnswer = (type, message) => {
    setAnswers([]);
    setPhase('intermission');
    socket.emit('select answer', type, message);
  }

  const onVote = (type, message) => {
    setAnswers([]);
    socket.emit('cast vote', type, message);
  }

  const renderWaitingRoom = () => <WaitingRoom nextRound={nextRound} />

  const renderSelectionPhase = () => <Selection question={question} answers={answers} onSelect={selectAnswer} />

  const renderVote = () => <Vote question={question} candidates={answers} onSelect={onVote} />

  const renderWinner = () => <Winner winner={winner} questionType={question.type} nextRound={nextRound}/>

  const renderPhase = (phase) => {
    switch (phase) {
      case 'waiting':
        return renderWaitingRoom();
      case 'selectAnswer':
        return renderSelectionPhase();
      case 'intermission':
        return <span>Intermission</span>
      case 'vote':
        return renderVote();
      case 'showWinner':
        return renderWinner();
      default:
        return renderSelectionPhase(); //this should never happen
    }
  }

  return (
    <div className="board">
      {renderPhase(phase)}
    </div>
  );
}

export default Board;