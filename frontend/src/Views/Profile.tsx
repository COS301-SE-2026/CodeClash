import { Link } from 'react-router-dom';
import { useLogOut, getProfile  } from '../ViewModels/ProfileViewModel';
import { Button } from '@/components/ui/button';
import { ArrowLeft} from "lucide-react"
import Starfield from '@/components/ui/animations/Starfield';
import "../styles/global.css"
import {UserAvatar} from "../avatar/UserAvatar";

function ProfileView(){

  const { loadingData, error} = getProfile();

  const onLogout = useLogOut();

  if(loadingData) return <div className="font-font font-semibold text-color-button-primary">Loading Data</div>;
  

  if(error) return <div className="font-font font-semibold, text-color-button-primary">Error loading user data</div>;


  return (
    <div className="w-full min-h-screen bg-primary-dark flex flex-col items-center justify-center text-secondary-text">
      <Link className="btn btn-ghost primary-back-button absolute top-3 left-3" to={'/dashboard'}
        onKeyDown={(e) => {
          const shift = e.shiftKey;
          if (shift && e.key === 'Esc') {
            // nav('/dashboard');
          }
        }}
      > 
      <ArrowLeft size={18}/>
      Back
      
      </Link>

        <div className="flex items-center w-[30%] h-[40%] mb-2 ml-4" >
          {/* <img src={userData?.avatar} alt="avatarImage" className="" /> */}
          <UserAvatar size={320}/>
        </div>

        <Starfield/>

        <Button
          variant={"default"}
          type="button"
          onClick={onLogout}
          className="w-[20%] h-[10%] py-5 mx-auto mb-6"
        >
          Log Out
        </Button>
    </div>
  );
};

const Profile = () => {
  return <ProfileView/>;
}

export default Profile;