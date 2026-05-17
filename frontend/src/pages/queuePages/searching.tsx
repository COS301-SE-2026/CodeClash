import './searching.css';



//create in searching page, when found immediately go to found, that is what can be in interface for searching


const Searching = () => {
  return (
    <div className="page-container">
      <div className="searching-section">
       <div className="purple-circle">
        <div className="searching-text">User 1</div>
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

export default Searching;