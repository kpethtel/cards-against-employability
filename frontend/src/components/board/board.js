import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import Winners from "../winners/winners.js";
import WaitingRoom from '../waiting_room/waiting_room.js';
import SelectionPhase from '../selection_phase/selection_phase.js';
import VotePhase from '../vote_phase/vote_phase.js';
import Timer from '../timer/timer.js';

import './board.css';

const Board = ({socket}) => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [winners, setWinners] = useState([]);
  const [phase, setPhase] = useState('waiting');
  const [timeLimit, setTimeLimit] = useState(null);

  useEffect(() => {
    socket.on('deal question', (currentPhase, time, question) => {
      setQuestion(question[0]);
      setPhase(currentPhase);
      setTimeLimit(time);
      setWinners([]);
    });
    socket.on('deal answers', data => {
      setAnswers(data);
      setPhase('selectAnswer');
    });
    socket.on('vote on selected', (currentPhase, time, voteableAnswers) => {
      setCandidates(voteableAnswers);
      setPhase(currentPhase);
      setTimeLimit(time);
    });
    socket.on('announce winners', (currentPhase, winningSelection) => {
      setWinners(winningSelection);
      setPhase(currentPhase);
      setTimeLimit(null);
    });
  });

  const startGame = () => {
    socket.emit('start game');
  }

  const selectAnswer = (type, selected) => {
    if (type === 'q&a') {
      const remainingAnswers = answers.filter(answer => answer !== selected);
      setAnswers(remainingAnswers);
    }

    setPhase('intermission');
    socket.emit('select answer', type, selected);
  }

  const onVote = (type, candidateId) => {
    setCandidates([]);
    setPhase('intermission');
    socket.emit('cast vote', type, candidateId);
  }

  const renderWaitingRoom = () => <WaitingRoom startGame={startGame} />

  const renderSelectionPhase = () => {
    return <SelectionPhase
      question={question}
      answers={answers}
      onSelect={selectAnswer}
    />
  }

  const renderVote = () => {
    return <VotePhase
      question={question}
      candidates={candidates}
      onSelect={onVote}
    />
  }

  const renderWinners = () => {
    return <Winners
      winners={winners}
      questionType={question.type}
    />
  }

  const renderPhase = () => {
    switch (phase) {
      case 'waiting':
        return renderWaitingRoom();
      case 'selection':
        return renderSelectionPhase();
      case 'intermission':
        return <span>Intermission</span>
      case 'voting':
        return renderVote();
      case 'results':
        return renderWinners();
      default:
        return renderSelectionPhase(); //this should never happen
    }
  }

  const renderClock = () => {
    return (timeLimit && phase !== 'intermission') ? <Timer limit={timeLimit} /> : null
  }

  return (
    <div className="board">
      {renderPhase()}
      {renderClock()}
    </div>
  );
}

Board.propTypes = {
  socket: PropTypes.object,
}

export default Board;