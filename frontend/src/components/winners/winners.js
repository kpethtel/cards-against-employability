import React from "react";

const Winners = ({winners, questionType}) => {

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
    <div className="winners">
      We have a winner
      {winners.map(winner => renderWinner(winner))}
    </div>
  )
}

export default Winners;