import { Search, Bot, UserCircle, ChevronRight } from 'lucide-react';
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
    <div>

    </div>
  )

}

export default Dashboard;