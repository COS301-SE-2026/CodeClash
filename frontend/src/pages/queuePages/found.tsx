import './found.css';

const Found = () => {
  return (
    <div className="page-container">
      <div className="searching-section">
        <div className="searching-text">Opponent Found!</div>
        <div className="row-circles">
       <div className="purple-circle">
        <div className="searching-text">User 1</div>
       </div>
       <div className="vs-text">vs</div>
       <div className="purple-circle">
        <div className="searching-text">User 2</div>
       </div>
       </div>

       <div className="timer-section">
          <div className="timer-icon"></div>
          <span className="timer-text">0:00</span>
        </div>

         <div className="searching-text">Searching for Opponent...</div>
        <div className="under-searching-text">Finding a player with similar Elo</div>

        <button className="cancel-button">Cancel Queue</button>

      </div>
    </div>
  );
};

export default Found;