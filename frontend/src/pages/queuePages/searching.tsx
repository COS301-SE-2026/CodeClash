import React, { useEffect, useState } from 'react';
import './searching.css';

interface SearchingProps {
  onCancel?: () => void;
  onFound?: () => void;
}

const Searching: React.FC<SearchingProps> = ({ onCancel, onFound }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  //Go to found after 5 seconds
  useEffect(() => {
    const id = setTimeout(() => onFound?.(), 5000);
    return () => clearTimeout(id);
  }, [onFound]);

  const mins = String(Math.floor(seconds / 60)).padStart(1, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  return (
    <div className="page-container">
      <div className="searching-section">
        <div className="purple-circle">
          <div className="searching-text">User 1</div>
        </div>
        <div className="timer-section">
          <div className="timer-icon"></div>
          <span className="timer-text">{mins}:{secs}</span>
        </div>
        <div className="searching-text">Searching for Opponent...</div>
        <div className="under-searching-text">Finding a player with similar Elo</div>
        <button className="cancel-button" onClick={onCancel}>Cancel Queue</button>
      </div>
    </div>
  );
};

export default Searching;