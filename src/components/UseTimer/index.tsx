import { useState, useEffect } from "react";

const useTimer = () => {
  const savedTime = sessionStorage.getItem("timer");
  const initialTime = savedTime
    ? JSON.parse(savedTime)
    : { hours: 0, minutes: 0, seconds: 0 };
  const [timer, setTimer] = useState(initialTime);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer: any) => {
        let { hours, minutes, seconds } = prevTimer;
        seconds += 1;
        if (seconds === 60) {
          minutes += 1;
          seconds = 0;
        }
        if (minutes === 60) {
          hours += 1;
          minutes = 0;
        }
        const newTimer = { hours, minutes, seconds };
        sessionStorage.setItem("timer", JSON.stringify(newTimer));
        return newTimer;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const clearTimer = () => {
    sessionStorage.removeItem("timer");
    setTimer({ hours: 0, minutes: 0, seconds: 0 });
  };

  const formattedTime = `${String(timer.hours).padStart(2, "0")}:${String(
    timer.minutes
  ).padStart(2, "0")}:${String(timer.seconds).padStart(2, "0")}`;

  return { formattedTime, clearTimer };
};

export default useTimer;
