import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../lib/utils";

export const Subheader = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="subheader bg-gray-200 py-2">
      <div className="h-100 flex justify-between container">
        <div className="float-left">
          <span className="left-padder hidden md:inline mr-2">Viewing As &gt;&gt;</span>
          <Link className="inline-flex" to="/">
            <span className="inline-flex justify-center items-center text-dark">Global</span>
          </Link>
        </div>
        <div className="float-right">
          <span>{formatDate(currentTime)}</span>
        </div>
      </div>
    </div>
  );
};

export default Subheader;
