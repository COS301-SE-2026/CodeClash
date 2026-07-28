import { type ProfileProps } from '../Models/ProfileModel';
import { useEdit, useLogOut } from '../ViewModels/ProfileViewModel';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import placeholder from '../assets/Avatar/placeholder.png'
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC<ProfileProps> = ({
  username = 'User Name',
  elo = 600,
  player_level = 'Level 32 - Mercury',
  current_streak = 522,
  winning_streak = 63,
  prev_page = "/dashboard"
}) => {

  const onLogout = useLogOut();
  const onEdit = useEdit();
  const nav = useNavigate();

  return (
    <div className="w-full min-h-screen bg-secondary flex flex-col items-center justify-center text-secondary-text">

      <Link className="secondary-back-button font-semibold" to={prev_page}
        onKeyDown={(e) => {
          const shift = e.shiftKey;
          if (shift && e.key === 'Esc') {
            nav(prev_page);
          }
        }}
      >
        ← Back
      </Link>

      <Card className="w-[30%] h-[45rem] flex items-center  bg-[#F8E5DD] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">

        <div className="w-[35%]" >
          <img src={placeholder} alt="placeholder-avatar" className="" />
        </div>
        <div className="text-xl font-semibold ">{username}</div>
        <div className=" text-md font-semibold ">{player_level}</div>
        <div>
          <span className="text-[1.5rem] ">Current Streak - {current_streak}</span>
        </div>

        <div className='mt-[9%] grid grid-flow-col grid-cols-2 gap-[6%] w-[70%]'>
          <Button
            variant={"default"}
            type="button"
            onClick={onLogout}
            className="w-[100%] py-5 text-md h-[60%] cursor-pointer"
            onKeyDown={(e) => {
              const ctrlOrCmd = e.ctrlKey || e.metaKey;
              if (ctrlOrCmd && e.key === 'Esc') {
                onLogout;
              }
            }
            }
          >
            Log Out
          </Button>

          <Button
            variant={"default"}
            type="button"
            onClick={onEdit}
            className="w-[100%] py-5 text-md h-[60%] cursor-pointer"
            onKeyDown={(e) => {
              const alt = e.altKey;
              if (alt && e.key === 'Enter') {
                onEdit
              }
            }}
          >
            Edit
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Profile;