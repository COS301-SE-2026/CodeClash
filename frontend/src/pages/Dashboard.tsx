
import searchIcon from '../assets/Icons/Search.png'
import aiIcon from '../assets/Icons/AI.png';
import profileIcon from '../assets/Icons/Profile.png';
import backgroundImg from '../assets/Background/dashboard.png'
import GlassCard from '@/components/shared/GlassCard'
import { Button } from '@/components/ui/button';
import { type DashUserDTO } from '../../dto/DashboardDTO';
import { Link } from 'react-router-dom';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';



const Dashboard = () => {
  return (
    <>

      <div style={{ backgroundImage: `url(${backgroundImg})` }} className='w-full bg-cover bg-center flex flex-col items-center'>
        {/* // Header */}
        <div className=' w-full bg-black/80 flex justify-between items-center h-[10%] pl-5 mb-20'>

          {/* Search bar */}
          <div className='flex items-center bg-pink-800/30 w-[35%] text-white h-[50%] rounded-3xl'>
            <img src={searchIcon} alt='search' className='h-[75%] pl-3 pr-3' />
            <p className='text-md font-light'>Search...</p>
          </div>

          {/* AI and Profile */}
          <div className='flex items-center w-[15%] h-full justify-evenly'>
            <img src={aiIcon} alt='AI' className=' h-[65%]' />
            <img src={profileIcon} alt='Profile' className=' h-[65%]' />

          </div>

        </div>

        {/* // Body */}
        <GlassCard className='flex flex-row text-white items-center pl-5 pr-5 h-[60%] w-[97%]  border  mb-25'>

          {/* First Column */}
          <div className='flex flex-col h-[90%] w-[30%] justify-between ml-5 mr-5'>
            {/* Username & Avataer */}
            <Card className='bg-[#070400] h-[40%]'>
              <CardContent className='flex '>
                <div className='flex flex-col'>
                  <p>Level #</p>
                  <p>username</p>
                </div>
                <img alt='avatar' />
              </CardContent>
            </Card>

            {/* Play Now */}
            <Card className='bg-[#070400] h-[40%]'>
              <CardHeader>
                <CardTitle className='text-l font-semibold'>PLAY NOW</CardTitle>
                <CardDescription>Select a game mode and start competing</CardDescription>
              </CardHeader>
              <CardContent className='flex h-[100%]'>
                <CardAction className='flex flex-col w-[100%] h-[100%] justify-evenly'>
                  <Button className='h-[35%] bg-pink-300 text-md font-semibold'>  Ranked Play </Button>
                  <Button variant={'secondary'} className='h-[35%] bg-secondary text-primary text-md font-semibold hover:bg-[#C0AF9C]'> Casual Play </Button>
                </CardAction>
              </CardContent>
            </Card>
          </div>

          {/* Elo Score */}
          <div className='flex flex-col w-[35%] items-center'>
            <p className='text-3xl font-semibold'>SKILL SCORE</p>
            <p className='text-l'>ELO</p>
          </div>

          {/* Stats */}
          <div className='flex flex-col h-[100%] w-[35%] justify-between'>
            <div className=' flex flex-row bg-[#070400] rounded-4xl p-4 text-md justify-between'>
              <p>CURRENT STREAK</p>
              <p> -</p>
              <p> #</p>
            </div>

            <div className=' flex flex-row bg-[#070400] rounded-4xl p-4 text-md justify-between'>
              <p>WINNING STREAK</p>
              <p> -</p>
              <p> #</p>
            </div>

            {/* Recently earned */}
            <div>
              <div className='flex justify-between mt-2 text-[1.5rem]'>
                <p className='font-semibold'>RECENTLY EARNED</p>
                <Link to='/badges' className='underline'>SEE ALL</Link>
              </div>

              <Card className='bg-[#070400] rounded-[40px]'>
                <div className='flex items-center'>
                  <div>
                    <CardHeader>
                      <CardTitle className='text-l font-semibold'>
                        Badge Name
                      </CardTitle>
                      <CardDescription>
                        Maths/Programming
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='mt-3 text-[1.6rem]'>
                      Description of why badge was awarded
                    </CardContent>
                  </div>
                  <img alt='badge image' className='bg-white text-black m-2 w-[22%] h-[7rem]' />
                </div>
              </Card>
            </div>

            {/* Skill Progress - Maths */}
            <div>
              <div className='flex justify-between p-3'>
                <div className='flex items-center font-semibold'>
                  <p className='text-[1.5rem]'>SKILL PROGRESS - </p>
                  <p>&nbsp;MATH</p>
                </div>
                <Link to='/badges' className='text-[1.5rem] underline'>SEE ALL</Link>
              </div>

              <Card className='bg-[#070400] flex flex-col items-center rounded-[40px]'>
                {/* loop through progress measures - how is this progress calculated? */}
                <div className='w-[90%]'>
                  <p>Metric Title</p>
                  <Progress className=" w-[100%] h-[2.3rem] scale-x-[-1] shadow-[0_4px_6px_rgba(0,0,0,0.3)]" ></Progress>
                </div>

                 <div className='w-[90%]'>
                  <p>Metric Title</p>
                  <Progress className=" w-[100%] h-[2.3rem] scale-x-[-1] shadow-[0_4px_6px_rgba(0,0,0,0.3)]" ></Progress>
                </div>

              </Card>
            </div>

            {/* Skill Progress - Prog */}
            <div>
              <div className='flex justify-between p-3'>
                <div className='flex items-center font-semibold'>
                  <p className='text-[1.5rem]'>SKILL PROGRESS - </p>
                  <p>&nbsp;PROGRAMMING</p>
                </div>
                <Link to='/badges' className='text-[1.5rem] underline'>SEE ALL</Link>
              </div>

              <Card className='bg-[#070400] flex flex-col items-center rounded-[40px]'>
                {/* loop through progress measures - how is this progress calculated? */}
                <div className='w-[90%]'>
                  <p>Metric Title</p>
                  <Progress className=" w-[100%] h-[2.3rem] scale-x-[-1] shadow-[0_4px_6px_rgba(0,0,0,0.3)]" ></Progress>
                </div>

                 <div className='w-[90%]'>
                  <p>Metric Title</p>
                  <Progress className=" w-[100%] h-[2.3rem] scale-x-[-1] shadow-[0_4px_6px_rgba(0,0,0,0.3)]" ></Progress>
                </div>

              </Card>
            </div>
          </div>
        </GlassCard>
      </div>
    </>
  )

}


export default Dashboard;