
import searchIcon from '../assets/Icons/Search.png'
import aiIcon from '../assets/Icons/AI.png';
import profileIcon from '../assets/Icons/Profile.png';
import backgroundImg from '../assets/Background/dashboard.png'

const Dashboard = () => {


  return (
    <>

      <div style={{ backgroundImage: `url(${backgroundImg})` }} className='w-full bg-yellow-400 bg-cover bg-center'>
        {/* // Header */}
        <div className=' w-full bg-pink-300 flex justify-between'>

          {/* Search bar */}
          <div className='flex items-center'>
            <img src={searchIcon} alt='search' />
            <p>Search...</p>
          </div>

          {/* AI and Profile */}

          <div>
            <img src={aiIcon} alt='AI' />
            <img src={profileIcon} alt='Profile' />

          </div>

        </div>

        {/* // Body */}
        <div className='bg-pink-700'>
          hello
          {/* Main Content */}
        </div>
      </div>
    </>
  )

}


export default Dashboard;