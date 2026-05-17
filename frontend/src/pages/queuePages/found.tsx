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
       <div className="blue-circle">
        <div className="searching-text">User 2</div>
       </div>
       </div>

       <div className="row-elo">
        <div className="elo-button">
          <div className="elo-button-text">570 ELO</div>
        </div>
        <div className="elo-button">
          <div className="elo-button-text">500 ELO</div>
        </div>
       </div>

        <div className="info-button">
          {/* <div className="big-row-info">
           <div className="row-info">
          <div className="info-button-text-grey">Match Type</div>
          <div className="info-button-text-black">Ranked</div>
           <div className="info-button-text-grey">Time Limit</div>
          <div className="info-button-text-black">15 minutes</div>
          </div>
          <div className="row-info">
          <div className="info-button-text-grey">Difficulty</div>
          <div className="info-button-text-black">Medium</div>
           <div className="info-button-text-grey">Number of Questions</div>
          <div className="info-button-text-black">5</div>
          </div> */}
          <div className="match-details-grid">
          <div className="grid-row">
            <div className="info-button-text-grey">Match Type</div>
            <div className="info-button-text-black">Ranked</div>
            <div className="info-button-text-grey">Time Limit</div>
            <div className="info-button-text-black">15 minutes</div>
          </div>
          <div className="grid-row">
            <div className="info-button-text-grey">Difficulty</div>
            <div className="info-button-text-black">Medium</div>
            <div className="info-button-text-grey">Number of Questions</div>
            <div className="info-button-text-black">5</div>
          </div>
        </div>
          
          
          
        </div>


      </div>
    </div>
  );
};

export default Found;