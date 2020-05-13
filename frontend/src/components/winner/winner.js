import React from "react";

const Winner = ({winner, questionType, nextRound}) => {

  const renderWinner = () => {
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
      {renderWinner()}
      <button label="next" onClick={nextRound}>Next</button>
    </div>
  )
}

export default Winner;