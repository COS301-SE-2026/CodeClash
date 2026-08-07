import { Search, Bot, UserCircle, ChevronRight, Swords, Users2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import backgroundImg from '../assets/Background/dashboard.png'
import brainIcon from '../assets/Icons/Brain.png';
import { useDashboardViewModel } from '../ViewModels/DashboardViewModel';

import Popup from './Popup'
import Loading from '@/components/shared/Loading';

type SkillMetric = {
  label: string;
  value: number;
}

const SkillProgressCard = ({
  title, items, seeAll,
} : {
  title: string;
  items: SkillMetric[];
  seeAll: string;
}) => (
  <div className='card-elevated p-5'>
    <div className='flex items-center justify-between mb-3'>
      <p className='text-sm font-bold text-primary-text'>Skill Progress - {title}</p>
      <Link to = {seeAll} className='badge badge-status-pending'>
        See all 
        <ChevronRight size = {12}/>
      </Link>
    </div>
    <div className='flex flex-col gap-4 rounded-2xl bg-background-elevated border border-border p-4'>
      {items.map((item) => (
        <div key = {item.label}>
          <div className='flex justify-between text-xsm text-muted mb-1.5'>
            <span>{item.label}</span>
            <span>{item.value}%</span>
          </div>
          <div className='progress-track'>
            <div className='progress-fill'
              style={{width: `${item.value}%`}}/>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const Dashboard = () => {
  const { isOpen, openPopUp, closePopUp, username, elo, league, avatar, isLoading } = useDashboardViewModel();

  if (isLoading) {
    return (
      <Loading isOpen={isLoading}></Loading>
    )
  }

  return (
    <div className='relative w-full min-h-screen bg-cover bg-center overflow-hidden'
      style={{backgroundImage: `url(${backgroundImg})`}}>
      <div className='absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background'/>
      {/*Starfield copied from SignIn */}
      <div className="starfield">
        {Array.from({length: 40}).map((_, i) => (
            <span key={i} style={{top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() *3};s`}}/>
        ))}
      </div>
      <div className='relative z-10 flex flex-col min-h-screen'>
        <header className='w-full flex items-center justify-between gap-4 px-8 py-4 border-b border-border bg-background/60 backdrop-blur-md'>
          <div className='flex items-center gap-2 w-full max-w-md rounded-3xl border border-border bg-card px-4 py-2.5'>
            <Search size={18} className='text-muted-text shrink-0'/>
            <input type='text' placeholder='Search' className='bg-transparent outline-none text-xsm text-primary-text placeholder:text-muted-text w-full'/>
          </div>

          <div className='flex items-center gap-5 shrink-0'>
            <button className='btn btn-ghost btn-icon' aria-label='Ask CodeClash AI (coming soon)'>
              <Bot size={20}/>
            </button>
            <Link to='/profile' className='avatar w-10 h-10 flex items-center justify-center overflow-hidden'>
              {avatar ? (
                <img src={avatar} alt='Your CodeClash avatar' className='w-full h-full object-cover'/>
              ) : (
                <UserCircle size={22} className='text-muted-text'/>
              )}
            </Link>
          </div>
        </header>

        <main className='flex-1 px-8 py-8'>
          <div className='grid grid-cols-1 lg:grid-cols-[1.1fr_1fr_1.2fr] gap-6 max-w-[1400px] mx-auto'>
            {/*Profile + Play */}
            <div className='flex flex-col gap-6'>
              <div className='card-elevated flex items-center gap-4 p-6'>
                <img src = {avatar} alt='' className='w-16 h-16 rounded-full border-2 border-primary object-cover shrink-0'/>
                <div>
                  <span>League - {league}</span>
                  <p className='text-xl font-black text-primart-text'>{username}</p>
                </div>
              </div>

              <div className='card-elevated p-6 text-center'>
                  <p className='eyebrow mb-1'>Play now</p>
                  <h2 className='text-md font-black text-primary-text mb-1 whitespace-nowrap'>Enter the arena</h2>
                  <p className='text-xsm text-muted mb-5'>Select a game mode and start competing</p>
                  <div className='flex flex-col gap-3'>
                    <button className='btn btn-primary w-full' onClick={() => openPopUp('ranked')}>
                      <Swords size= {18}/>
                      Ranked Play
                    </button>
                    <button className='btn btn-secondary w-full' onClick={() => openPopUp('casual')}>
                      <Users2 size= {18}/>
                      Casual Play
                    </button>
                  </div>
                </div> 
              </div>

          </div>
        </main>
      </div>
    </div>
  )

}

export default Dashboard;