import { Link } from 'react-router-dom';
import { useUser } from 'src/context/User/hooks/useUser';

import { useLogOut, getProfile  } from '../ViewModels/ProfileViewModel';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Stand } from 'src/animations/poses/rig';
import { Peace } from 'src/animations/poses/peace';
import { Okay } from 'src/animations/poses/okay';
import { Thinking } from 'src/animations/poses/thinking';

const colours = [
  
]

const poses = [
  {id: "okay", label: "Okay", preview: Okay},
  {id: "peace", label: "Peace", preview: Peace},
  {id: "thinking", label: "Thinking", preview: Thinking}
];



function ProfileView(){
  
  const { userData, loadingData, error} = getProfile();

  const onLogout = useLogOut();

  if(loadingData) return <div className="font-font font-semibold text-color-button-primary">Loading Data</div>;
  

  if(error) return <div className="font-font font-semibold, text-color-button-primary">Error loading user data</div>;


  return (
    <div className="w-full min-h-screen bg-secondary flex flex-col items-center justify-center text-secondary-text">

      <Link className="secondary-back-button font-semibold" to={'/dashboard'}
        onKeyDown={(e) => {
          const shift = e.shiftKey;
          if (shift && e.key === 'Esc') {
            // nav('/dashboard');
          }
        }}
      >
        ← Back
      </Link>

      <Card className="w-[40%] h-[50%] flex items-center justify-center bg-[#F8E5DD]">

        <div className="w-[35%]" >
          {/* <img src={userData?.avatar} alt="avatarImage" className="" /> */}
          <Stand/>
        </div>
        <div className="text-xl font-semibold ">{userData?.username}</div>
        <div className=" text-md font-semibold ">ELO - {userData?.elo}</div>
        <div className="text-md font-semibold">{userData?.league}</div>
        <div>
          <p className="text-[1.5rem] ">Current Rank - {userData?.rank}</p>
        </div>

        <div className="profile-divider" />

        <Button
          variant={"default"}
          type="button"
          onClick={onLogout}
          className="w-[70%] py-5"
        >
          Log Out
        </Button>

      </Card>
    </div>
  );
};

const Profile = () => {
  return <ProfileView/>;
}

export default Profile;