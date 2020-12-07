import React from "react";
import PropTypes from 'prop-types';

const Winners = ({winners, questionType}) => {

  const renderWinner = (winner) => {
    switch (questionType) {
      case 'q&a':
        return <span>{winner}</span>
      case 'gif':
        return (
          <figure>
            <img src={winner.answer} alt="winner" />
            <figcaption>{winner.userName}</figcaption>
          </figure>
        )
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

Winners.propTypes = {
  winners: PropTypes.array,
  questionType: PropTypes.string,
}

export default Winners;