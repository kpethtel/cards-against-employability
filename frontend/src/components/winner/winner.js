import React from "react";

const Winner = ({winners, questionType, nextRound}) => {

  const renderWinner = (winner) => {
    switch (questionType) {
      case 'q&a':
        return <span>{winner}</span>
      case 'gif':
        return <img src={winner} alt="winner" />
      default:
        break;
    }
  }

  return (
    <div className="winner">
      We have a winner
      {winners.map(winner => renderWinner(winner))}
      <button label="next" onClick={nextRound}>Next</button>
    </div>
  )
}

export default Winner;