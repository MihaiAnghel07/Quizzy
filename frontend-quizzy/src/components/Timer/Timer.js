import React, { useState, useEffect } from 'react';
import './Timer.css'

function Timer({ seconds, onTimerComplete }) {
    const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft == 1) {
          clearInterval(timerId);
          onTimerComplete();
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    return () => clearInterval(timerId); 
  }, [seconds, onTimerComplete]);

  const formattedTime = new Date(timeLeft * 1000).toISOString().substr(14, 5);

  const isTimeAlmostUp = timeLeft <= 10

  return (
    <div className={`timer-text ${isTimeAlmostUp ? 'timer-component-red' : 'timer-component'}`}>
      {formattedTime}
    </div>
  );
}

export default Timer;
