import React from "react";

const WaitingRoom = ({nextRound}) => {
  return <button label="start" onClick={nextRound}>Start</button>
}

export default WaitingRoom;