
import searchIcon from '../assets/Icons/Search.png'
import aiIcon from '../assets/Icons/AI.png';
import profileIcon from '../assets/Icons/Profile.png';
import backgroundImg from '../assets/Background/dashboard.png'
import GlassCard from '@/components/shared/GlassCard'

const Dashboard = () => {


  return (
    <>

      <div style={{ backgroundImage: `url(${backgroundImg})` }} className='w-full bg-yellow-400 bg-cover bg-center flex flex-col items center justify-center'>
        {/* // Header */}
        <div className=' w-full bg-black/80 flex justify-between items-center h-[12%] pl-5'>

          {/* Search bar */}
          <div className='flex items-center bg-pink-800/30 w-[35%] text-white h-[50%] rounded-3xl'>
            <img src={searchIcon} alt='search' className='h-[75%] pl-3 pr-3' />
            <p className='text-md font-light'>Search...</p>
          </div>

          {/* AI and Profile */}
          <div className='flex items-center w-[15%] h-full justify-evenly'>
            <img src={aiIcon} alt='AI' className=' h-[65%]'/>
            <img src={profileIcon} alt='Profile' className=' h-[65%]'/>

          </div>

        </div>

        {/* // Body */}
        <GlassCard>

        </GlassCard>
      </div>
    </>
  )

}


export default Dashboard;