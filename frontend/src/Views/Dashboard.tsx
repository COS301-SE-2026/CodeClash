import {ChevronRight, Swords, Users2, Flame, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboardViewModel } from '../ViewModels/DashboardViewModel';
import Popup from './Popup'
import Loading from '@/components/shared/Loading';
import Starfield from '@/components/ui/animations/Starfield';
import ComingSoon from '@/components/ui/ComingSoon';

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
      <div>
        <p className='text-sm font-bold text-primary-text'>Skills Progress</p>
      </div>
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
    <div className='relative w-full min-h-screen bg-cover bg-center overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background'/>
      <Starfield/>

        <div className='relative z-10'>
          <div className='grid grid-cols-1 lg:grid-cols-[1.1fr_1fr_1.2fr] gap-6 max-w-[1400px] mx-auto items-start'>
            {/*Profile + Play */}
            <div className='flex flex-col gap-6'>
              <div className='card-elevated flex items-center gap-4 p-8'>
                <img src = {avatar} alt='' className='w-16 h-16 rounded-full border-2 border-primary object-cover shrink-0'/>
                <div>
                  <p className='text-xl font-black text-primary-text'>{username}</p>
                  <span className='text-sm text-primary-text'>{league}</span>
                </div>
              </div>

              <div className='card-elevated p-6 text-center'>
                  <h2 className='text-md font-black text-primary-text mb-1 whitespace-nowrap'>Enter the arena</h2>
                  <p className='text-xsm text-muted mb-5'>Select a game mode and start competing</p>
                  <div className='flex flex-col gap-3'>
                    <button className='btn btn-primary w-full' onClick={() => openPopUp('ranked')} type='button'>
                      <Swords size= {18}/>
                      Ranked Play
                    </button>
                    <button className='btn btn-secondary w-full' onClick={() => ComingSoon} type='button'  disabled title='Coming Soon!'>
                      <Users2 size= {18}/>
                      Casual Play
                    </button>
                  </div>
                </div> 
            </div>

            <div className='relative z-10 flex flex-col gap-6'>
                {/*Stats - copied from above, i just decided to chnage the place cause the RHS was much more populated than LHS */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='card-elevated flex flex-col items-center justify-center gap-1 py-5'>
                    <Flame size={20} className='font-black mb-1'/>
                    <p className='text-xsm uppercase tracking-wide font-black text-center justify-center'>Current Streak</p>
                    <p className='score-display text-2xl font-black'>-</p>
                  </div>
                  <div className='card-elevated flex flex-col items-center justify-center gap-1 py-5'>
                    <Sparkles size={20} className='font-black mb-1'/>
                    <p className='text-xsm uppercase tracking-wide font-black text-center justify-center'>Winning Streak</p>
                    <p className='score-display text-2xl font-black'>-</p> 
                  </div>
                </div>
              {/*Skill score */}
              <div className='card-elevated flex flex-col items-center justify-center p-8 text-center'>
                <p className='mb-4 text-md font-black'>Elo Rating</p>
                <p className='score-display text-6xl mb-2 font-black'>{elo}</p>
              </div>
            </div>

                {/*Recntly earned */}
              <div className='flex flex-col gap-6'>
                <div className='card-elevated p-5'>
                  <div className='flex items-center justify-between mb-3'>
                    <p className='text-sm font-bold text-primary-text'>Recently Earned</p>
                    <Link to='/achievements' className='badge badge-status-pending'>
                    See all 
                    <ChevronRight size={12}/>
                    </Link>
                  </div>
                  <div className='flex items-center gap-4 rounded-2xl bg-background-elevated border border-border p-3'>
                    <div>
                      <p className='text-sm font-semibold text-muted'>Badge Name</p>
                      <p className='text-xsm text-muted-text mt-1'>Description of award</p>
                    </div>
                  </div>
                </div>

                <SkillProgressCard title='Math' seeAll='/stats' items={[
                  {label: 'Metric Title', value: 65},
                  {label: 'Metric Title', value: 40}
                ]}/>
              </div>
          </div>
        </div>

      {isOpen && <Popup isOpen={isOpen} onClose={closePopUp}/>}
    </div>
  )
}

export default Dashboard;