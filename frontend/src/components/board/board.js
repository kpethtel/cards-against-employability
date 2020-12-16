import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import Winners from "../winners/winners.js";
import WaitingRoom from '../waiting_room/waiting_room.js';
import SelectionPhase from '../selection_phase/selection_phase.js'
import VotePhase from '../vote_phase/vote_phase.js'

import './board.css';

const Board = ({socket}) => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [winners, setWinners] = useState([]);
  const [phase, setPhase] = useState('waiting');
  useEffect(() => {
    socket.on('deal question', (currentPhase, question) => {
      setQuestion(question[0]);
      setPhase(currentPhase);
      setWinners([]);
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

  return (
    <div className="board">
      {renderPhase()}
    </div>
  );
}

Board.propTypes = {
  socket: PropTypes.object,
}

export default Board;