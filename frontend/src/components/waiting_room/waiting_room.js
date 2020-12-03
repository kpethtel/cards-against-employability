import React from "react";
import PropTypes from 'prop-types';

const WaitingRoom = ({startGame}) => {
  return <button label="start" onClick={startGame}>Start</button>
}

WaitingRoom.propTypes = {
  startGame: PropTypes.func,
}

export default WaitingRoom;