
import backgroundImg from '../assets/Background/dashboard.png'
import robot from '../assets/Robots/Pink_fighting.png'
import brainIcon from '../assets/Icons/Brain.png'; //this is png cause brain contributes to theme of learning for thr game
import GlassCard from '@/components/shared/GlassCard'
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {Search, Bot, UserCircle} from 'lucide-react';

const Dashboard = () => {
  return (
    <div style={{ backgroundImage: `url(${backgroundImg})` }} className='w-full h-[20] h-screen bg-cover bg-center flex flex-col items-center'>
      {/* Header */}
      <div className='w-[100%] h-[10%] bg-black/80 flex justify-between items-center pl-5 mb-20'>

        {/* Search bar */}
        <div className='flex items-center bg-pink-800/30 text-white w-[40%] h-[35%] rounded-3xl px-4 gap-4'>
          <Search className='text-white w-5 h-5 flex-shrink-0'/>
          <p className='text-sm font-light'>Search...</p>
        </div>

        {/* AI and Profile */}
        <div className='flex items-center w-[10%] h-full justify-evenly gap-5 pr-4'>
          <button className='flex items-center justify-center bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity'>
            <Bot className='text-white w-7 h-7'/>
          </button>

          <Link to="/profile" className="h-[55%]">
            <UserCircle className='text-white w-6 h-6 h-[100%]' />
          </Link>


        </div>

      </div>

      {/* // Body */}
      <GlassCard className='flex flex-row text-white items-center pl-5 pr-5 w-[97%] border h-[78%]'>

        {/* First Column */}
        <div className='flex flex-col  w-[35%] justify-between ml-5 mr-5 h-[90%]'>
          {/* Username & Avataer */}
          <Card className='bg-[#070400] h-[50%]'>
            <CardContent className='flex '>
              <div className='flex flex-col'>
                <p className='text-sm'>Level #</p>
                <p className='text-l'>username</p>
              </div>
              <img alt='avatar' src={robot} className='absolute h-[47%] left-[12%]' />
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
                <Button asChild variant={'default'} className='h-[45%] bg-pink-300 text-sm font-semibold'>
                  <Link to="/match-searching">Ranked Play</Link>
                </Button>
                <Button asChild variant={'secondary'} className='h-[45%] bg-secondary text-primary text-sm font-semibold hover:bg-[#C0AF9C]'>
                  <Link to="/match-searching">Casual Play</Link>
                </Button>
              </CardAction>
            </CardContent>
          </Card>
        </div>

        {/* Elo Score */}
        <div className='flex flex-col w-[35%] items-center'>
          <p className='text-3xl font-semibold'>SKILL SCORE</p>
          <p className='text-l'>###ELO</p>
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
              <img src={brainIcon} alt='badge image' className='text-black h-[6rem]' />
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
    </div>
  )

}


export default Dashboard;
