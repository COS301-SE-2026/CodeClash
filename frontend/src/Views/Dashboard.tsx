import {ChevronRight, Swords, Users2, Trophy, Flame, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD

import backgroundImg from '../assets/Background/dashboard.png'
import brainIcon from '../assets/Icons/Brain.png';
=======

import backgroundImg from '../assets/Background/dashboard.png'
>>>>>>> 5378a30cd86c953bdc20aa94765d31b947e8a4e4
import { useDashboardViewModel } from '../ViewModels/DashboardViewModel';

import Popup from './Popup'
<<<<<<< HEAD


import GlassCard from '@/components/shared/GlassCard'
import Loading from '@/components/shared/Loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useEffect } from 'react';


const Dashboard = () => {
  const { isOpen, openPopUp, closePopUp, username, elo, league, avatar, isLoading, refresh } = useDashboardViewModel();

  useEffect(() => {
    refresh();
  },[isLoading])


  if (isLoading) {
    return (
      <Loading isOpen={isLoading}></Loading>
    )
  }

  return (
    <div style={{ backgroundImage: `url(${backgroundImg})` }} className='w-full h-[20] h-screen bg-cover bg-center flex flex-col items-center'>
      {/* Header */}
      <div className='w-[100%] h-[10%] bg-black/80 flex justify-between items-center pl-5 mb-20'>

        {/* Search bar */}
        <div className='flex items-center bg-pink-800/30 text-white w-[40%] h-[35%] rounded-3xl gap-3'>
          <Search className="text-white w-5 h-5 flex-shrink-0" />
          <p className='text-sm font-light'>Search...</p>
        </div>

        {/* AI and Profile */}
        <div className='flex items-center w-[15%] h-full justify evenly gap-4'>
          <Bot className='text-white w-7 h-7' />

          <Link to="/profile">
            <UserCircle className='text-white w-7 h-7' />
          </Link>

        </div>

      </div>

      {/* // Body */}
      <GlassCard className=' flex flex-row text-white items-center justify-center pl-5 pr-5 w-[97%] border h-[78%]'>

        {/* First Column */}
        <div className='flex flex-col  w-[35%] justify-between ml-5 mr-5 h-[90%]'>
          {/* Username & Avataer */}
          <Card className='bg-[#070400] h-[50%]'>
            <CardContent className='flex '>
              <div className='flex flex-col'>
                <p className='text-sm'>LEAGUE {league}</p>
                <p className='text-l'>{username}</p>
              </div>
              <img alt='avatar' src={avatar} className='absolute h-[47%] left-[12%]' />
            </CardContent>
          </Card>

          {/* Play Now */}
          <Card className='bg-[#070400]'>
            <CardHeader>
              <CardTitle className='text-l font-semibold'>PLAY NOW</CardTitle>
              <CardDescription className='text-xsm'>Select a game mode and start competing</CardDescription>
            </CardHeader>
            <CardContent className='flex'>
              <CardAction className='flex flex-col w-[100%] h-[6rem] justify-between'>
                <Button variant={'default'} className='h-[45%] bg-pink-300 text-sm font-semibold'
                  onClick={() => openPopUp('ranked')}>
                  Ranked Play
                </Button>
                <Button variant={'secondary'} className='h-[45%] bg-secondary text-primary text-sm font-semibold hover:bg-[#C0AF9C]'
                  onClick={() => openPopUp('casual')}>
                  Casual Play
                </Button>
              </CardAction>
            </CardContent>
          </Card>
        </div>

        {/* Elo Score */}
        <div className='flex flex-col w-[35%] items-center'>
          <p className='text-3xl font-semibold'>SKILL SCORE</p>
          <p className='text-l'>{elo} &nbsp; ELO</p>
        </div>

        {/* Stats */}
        <div className='flex flex-col w-[35%] h-[94%] justify-between '>
          <div className='h-[7%] flex flex-row items-center bg-[#070400] rounded-4xl p-4 text-xsm justify-between'>
            <p>CURRENT STREAK</p>
            <p> -</p>
            <p> #</p>
          </div>

          <div className='h-[7%] flex flex-row items-center bg-[#070400] rounded-4xl p-4 text-xsm justify-between'>
            <p>WINNING STREAK</p>
            <p> -</p>
            <p> #</p>
          </div>

          {/* Recently earned */}
          <div>
            <div className='flex justify-between mt-2 text-[1rem]'>
              <p className='font-semibold'>RECENTLY EARNED</p>
              <Link to='/badges' className='underline'>
                <Badge variant={'link'} className='text-xsm bg-secondary/30 py-3'>
                  SEE ALL
                </Badge>
              </Link>
            </div>

            <div className='flex flex-row justify-evenly bg-[#070400] rounded-[30px] items-center p-2'>
              <div className='ml-[4%]'>
                <div className='text-sm font-semibold'>
                  Badge Name
                </div>
                <div className='text-[1rem]'>
                  Maths/Programming
                </div>
                <div className='mt-2 text-[0.8rem]'>
                  Description of why badge was awarded
                </div>
              </div>
              <img src={brainIcon} alt='badge' className='text-black h-[6rem]' />
            </div>
          </div>

          {/* Skill Progress - Maths */}
          <div>
            <div className='flex justify-between pt-2'>
              <div className='flex items-center font-semibold text-[1rem]'>
                <p>SKILL PROGRESS - </p>
                <p>&nbsp;MATH</p>
              </div>
              <Link to='/stats' className='underline'>
                <Badge variant={'link'} className='text-xsm bg-secondary/30 py-3'>
                  SEE ALL
                </Badge>

              </Link>
            </div>

            <div className='flex flex-col justify-evenly bg-[#070400] rounded-[30px] items-center h-[7.5rem]'>
              {/* loop through progress measures - how is this progress calculated? */}
              <div className='w-[90%] h-[30%]'>
                <p className='text-xsm'>Metric Title</p>
                <Progress className=" w-[100%] h-[60%] shadow-[0_4px_6px_rgba(0,0,0,0.3)] bg-[#E4BBCA]" progress_colour='#DC1860'></Progress>
              </div>

              <div className='w-[90%] h-[30%] m-2'>
                <p className='text-xsm'>Metric Title</p>
                <Progress className=" w-[100%] h-[60%] shadow-[0_4px_6px_rgba(0,0,0,0.3)] bg-[#E4BBCA]" ></Progress>
              </div>
            </div>
          </div>

          {/* Skill Progress - Prog */}
          <div>
            <div className='flex justify-between'>
              <div className='flex items-center font-semibold text-[1rem]'>
                <p>SKILL PROGRESS - </p>
                <p>&nbsp;PROGRAMMING</p>
              </div>
              <Link to='/stats' className='underline'>
                <Badge variant={'link'} className='text-xsm bg-secondary/30 py-3'>
                  SEE ALL
                </Badge>

              </Link>
            </div>

            <div className='flex flex-col justify-evenly bg-[#070400] rounded-[30px] items-center h-[7.5rem]'>
              {/* loop through progress measures - how is this progress calculated? */}
              <div className='w-[90%] h-[30%]'>
                <p className='text-xsm'>Metric Title</p>
                <Progress className=" w-[100%] h-[60%] shadow-[0_4px_6px_rgba(0,0,0,0.3)] bg-[#E4BBCA]" ></Progress>
              </div>

              <div className='w-[90%] h-[30%] m-2'>
                <p className='text-xsm'>Metric Title</p>
                <Progress className=" w-[100%] h-[60%] shadow-[0_4px_6px_rgba(0,0,0,0.3)] bg-[#E4BBCA]" ></Progress>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {isOpen && <Popup isOpen={isOpen} onClose={closePopUp} ></Popup>}
    </div>
  )

}


=======

import Loading from '@/components/shared/Loading';
import Starfield from '@/components/ui/animations/Starfield';

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
        <p className='text-sm font-bold text-primary-text'>Skill Progress</p>
        <p className='text-xsm text-muted uppercase'>{title}</p>
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
  const { isOpen, openPopUp, closePopUp, username, elo, league, avatar, isLoading, current_streak, winning_streak, recentAchievement } = useDashboardViewModel();

  if (isLoading) {
    return (
      <Loading isOpen={isLoading}></Loading>
    )
  }

  return (
    <div className='relative w-full min-h-screen bg-cover bg-center overflow-hidden'
      style={{backgroundImage: `url(${backgroundImg})`}}>
      <div className='absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background'/>
      <Starfield/>

        <div className='relative z-10'>
          <div className='grid grid-cols-1 lg:grid-cols-[1.1fr_1fr_1.2fr] gap-6 max-w-[1400px] mx-auto items-start'>
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
                    <button className='btn btn-primary w-full' onClick={() => openPopUp('ranked')} type='button'>
                      <Swords size= {18}/>
                      Ranked Play
                    </button>
                    <button className='btn btn-secondary w-full' onClick={() => openPopUp('casual')} type='button'>
                      <Users2 size= {18}/>
                      Casual Play
                    </button>
                  </div>
                </div> 

                {/*Stats - copied from below, i just decided to chnage the place cause the RHS was much more populated than LHS */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='card-elevated flex flex-col items-center justify-center gap-1 py-5'>
                    <Flame size={20} className='text-primary mb-1'/>
                    <p className='text-xsm uppercase tracking-wide text-muted'>Current Streak</p>
                    <p className='score-display text-2xl'>{current_streak ?? '-'}</p>
                  </div>
                  <div className='card-elevated flex flex-col items-center justify-center gap-1 py-5'>
                    <Sparkles size={20} className='text-primary mb-1'/>
                    <p className='text-xsm uppercase tracking-wide text-muted'>Winning Streak</p>
                    <p className='score-display text-2xl'>{winning_streak ?? '-'}</p>
                  </div>
              </div>
            </div>

              {/*Skill score */}
              <div className='card-glow flex flex-col items-center justify-center p-8 text-center'>
                <p className='eyebrow mb-4'>Skill Score</p>
                <p className='score-display text-6xl mb-2'>{elo}</p>
                <p className='text-xsm uppercase tracking=[0.2rem] text-muted'>Elo Rating</p>
                <span className='divider w-full my-6'/>
                <span>
                  <Trophy size= {14}/>
                  {league} League
                </span>
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
                    {recentAchievement ? (
                      <>
                        <div className='w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center shrink-0'>
                          {recentAchievement.icon === 'trophy' && <Trophy size={18} className='text-primary'/>}
                          {recentAchievement.icon === 'flame' && <Flame size={18} className='text-primary'/>}
                          {recentAchievement.icon === 'zap' && <Sparkles size={18} className='text-primary'/>}
                          {recentAchievement.icon === 'medal' && <Trophy size={18} className='text-primary'/>}
                        </div>
                        <div>
                          <p className='text-sm font-semibold text-primary'>{recentAchievement.name}</p>
                          <p className='text-xsm text-muted-text mt-1'>{recentAchievement.description}</p>
                        </div>
                      </>
                    ) : (
                      <p className='text-xsm text-muted'>No achievements earned yet. Play a match!</p>
                    )}
                  </div>
                </div>

                <SkillProgressCard title='Math' seeAll='/stats' items={[
                  {label: 'Metric Title', value: 65},
                  {label: 'Metric Title', value: 40}
                ]}/>
                <SkillProgressCard title='Programming' seeAll='/stats' items={[
                  {label: 'Metric Title', value: 80},
                  {label: 'Metric Title', value: 85}
                ]}/>
              </div>
          </div>
        </div>

      {isOpen && <Popup isOpen={isOpen} onClose={closePopUp}/>}
    </div>
  )
}

>>>>>>> 5378a30cd86c953bdc20aa94765d31b947e8a4e4
export default Dashboard;