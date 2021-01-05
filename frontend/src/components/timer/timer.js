import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';

const OneSecond = 1000;
const VisibilityThreshold = 5000;

const Timer = ({limit, timerFor}) => {

  const [timeLimit, setTimeLimit] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    setId(timerFor);
    setTimeLimit(limit);
    setTimeLeft(limit);
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0) {
      waitOneSecond();
    }
  }, [timeLeft]);

  const waitOneSecond = () => {
    const remaining = timeLeft - OneSecond
    setTimeout(() => setTimeLeft(remaining), OneSecond);
  }

  const secondsRemaining = () => timeLeft / OneSecond

  const visible = () => timeLimit && timeLeft <= VisibilityThreshold

  const renderClock = () => <span>Time remaining: {secondsRemaining()}</span>

  return (
    visible() ? renderClock() : null
  )
}

Timer.propTypes = {
  limit: PropTypes.number,
  timerFor: PropTypes.string,
}

export default Timer;