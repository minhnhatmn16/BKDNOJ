import { useEffect, useState } from "react";

interface ContestStatusTimerProps {
  startTime: string;
  duration: number;
  currentTime?: Date;
}

const ContestStatusTimer = ({ startTime, duration, currentTime }: ContestStatusTimerProps) => {
  const [now, setNow] = useState(currentTime || new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const start = new Date(startTime);
  const end = new Date(start.getTime() + duration * 60 * 1000);

  if (now < start) {
    const diffMs = start.getTime() - now.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const day = Math.floor(diffSec / (60 * 60 * 24));
    const hour = Math.floor((diffSec % (60 * 60 * 24)) / (60 * 60));
    const min = Math.floor((diffSec % (60 * 60)) / 60);
    const sec = diffSec % 60;

    return (
      <div className="space-y-1 text-center text-sm text-gray-500">
        <div>
          <strong>Contest starts at:</strong> {start.toLocaleString("en-GB", { hour12: false })}
        </div>
        <div>
          <strong>Duration:</strong> {duration} minutes
        </div>
        <div className="mt-2 font-semibold text-blue-600">
          Contest will start in: {day > 0 && `${day}d `}
          {hour > 0 && `${hour}h `}
          {min > 0 && `${min}m `}
          {sec}s
        </div>
      </div>
    );
  } else if (now >= start && now <= end) {
    const diffMs = end.getTime() - now.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const day = Math.floor(diffSec / (60 * 60 * 24));
    const hour = Math.floor((diffSec % (60 * 60 * 24)) / (60 * 60));
    const min = Math.floor((diffSec % (60 * 60)) / 60);
    const sec = diffSec % 60;

    return (
      <div className="space-y-1 text-center text-sm text-gray-500">
        <div>
          <strong>Contest started at:</strong> {start.toLocaleString("en-GB", { hour12: false })}
        </div>
        <div>
          <strong>Duration:</strong> {duration} minutes
        </div>
        <div className="mt-2 font-semibold text-green-600">
          Contest is running. Ends in: {day > 0 && `${day}d `}
          {hour > 0 && `${hour}h `}
          {min > 0 && `${min}m `}
          {sec}s
        </div>
      </div>
    );
  } else {
    return (
      <div className="space-y-1 text-center text-sm text-gray-500">
        <div>
          <strong>Contest ended at:</strong> {end.toLocaleString("en-GB", { hour12: false })}
        </div>
        <div>
          <strong>Duration:</strong> {duration} minutes
        </div>
        <div className="mt-2 font-semibold text-red-600">Contest has ended</div>
      </div>
    );
  }
};

export default ContestStatusTimer;
