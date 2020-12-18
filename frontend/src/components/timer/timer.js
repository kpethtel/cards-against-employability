import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';

const OneSecond = 1000;

const Timer = ({limit}) => {

  const [timeLimit, setTimeLimit] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (limit && limit !== timeLimit) {
      setTimeLimit(limit);
      startTimer(limit);
    }
  });

  const startTimer = (timeLeft) => {
    if (timeLeft < OneSecond) return
    const timeRemaining = timeLeft - OneSecond
    setTimeLeft(timeRemaining);
    setTimeout(() => startTimer(timeRemaining), OneSecond);
  }

  const secondsRemaining = () => {
    return timeLeft / OneSecond
  }

  const visible = () => {
    return timeLimit && secondsRemaining() < 5
  }

  const renderClock = () => {
    return <span>Time remaining: {secondsRemaining()}</span>
  }

  return (
    visible() ? renderClock() : null
  )
}

Timer.propTypes = {
  limit: PropTypes.number,
}

export default Timer;