import './notFound.css';

const notFound = () => {
  return (
    <div className="page-container">
      <div className="searching-section">

        <div className="notFound-text">Opponent Not Found!</div>
        <div className="searching-text">Please select one of the following</div>

        
        <div className="row-button">
          <button className="cancel-button">Return to dashboard</button>
          <button className="approve-button">Accept Match</button>
          </div>


      </div>
    </div>
  );
};

export default notFound;