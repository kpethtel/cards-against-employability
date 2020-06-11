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
  const [candidates, setCandidates] = useState([]);
  const [winners, setWinners] = useState([]);
  const [phase, setPhase] = useState('waiting');
  useEffect(() => {
    socket.on('deal question', (currentPhase, question) => {
      setQuestion(question[0]);
      setPhase(currentPhase);
      setWinners('');
    });
    socket.on('deal answers', data => {
      setAnswers(data);
      setPhase('selectAnswer');
    });
    socket.on('vote on selected', (currentPhase, voteableAnswers) => {
      setCandidates(voteableAnswers);
      setPhase(currentPhase);
    });
    socket.on('announce winners', (currentPhase, winningSelection) => {
      setWinners(winningSelection);
      setPhase(currentPhase);
    });
  }, []);

  const nextRound = () => {
    socket.emit('start round');
  }

  const selectAnswer = (type, selected) => {
    if (type === 'q&a') {
      const remainingAnswers = answers.filter(answer => answer !== selected);
      setAnswers(remainingAnswers);
    }

    setPhase('intermission');
    socket.emit('select answer', type, selected);
  }

  const onVote = (type, message) => {
    setCandidates([]);
    socket.emit('cast vote', type, message);
  }

  const renderWaitingRoom = () => <WaitingRoom nextRound={nextRound} />

  const renderSelectionPhase = () => <Selection question={question} answers={answers} onSelect={selectAnswer} />

  const renderVote = () => <Vote question={question} candidates={candidates} onSelect={onVote} />

  const renderWinners = () => <Winner winners={winners} questionType={question.type} nextRound={nextRound}/>

  const renderPhase = (phase) => {
    switch (phase) {
      case 'waiting':
        return renderWaitingRoom();
      case 'select answers':
        return renderSelectionPhase();
      case 'intermission':
        return <span>Intermission</span>
      case 'vote':
        return renderVote();
      case 'show winners':
        return renderWinners();
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