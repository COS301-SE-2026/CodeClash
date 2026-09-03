import { Link } from 'react-router-dom';
import { useUser } from 'src/context/User/hooks/useUser';
import { useState } from 'react';
import { useLogOut, getProfile  } from '../ViewModels/ProfileViewModel';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Stand } from 'src/animations/poses/rig';
import { Peace } from 'src/animations/poses/peace';
import { Okay } from 'src/animations/poses/okay';
import { Thinking } from 'src/animations/poses/thinking';
import "../styles/global.css"

const colours = [
  {id: "bg1", label: "Dark Pink", value: "[val(--primary-dark)]"},
  {id: "bg2", label: "Medium Pink", value: "[val(--primary)]"},
  {id: "bg3", label: "Light Pink", value: "[val(--primary-text)]"}
]

const poses = [
  {id: "rig", label: "Original", preview: Stand},
  {id: "okay", label: "Okay", preview: Okay},
  {id: "peace", label: "Peace", preview: Peace},
  {id: "thinking", label: "Thinking", preview: Thinking}
];

function FinalAvatarDisplay({pose, bg, onClick}){
  
  const poseData = poses.find((p) => p.id === pose) ?? poses[0];
  const bgData = colours.find((c) => c.id === bg)?? colours[0];

  return(
    <button
      onClick={onClick}
      style={{ backgroundColor: bgData.value}}
      className="w-[100%] h-[80%] justify-center items-center"
    >
      
        <div className="flex items-center justify-center">
          <poseData.preview vb1={170} vb2={250}/>
        </div>
      
    </button>
  )
}


function ProfileView(){

  const [pose, setPose] = useState("rig");
  const [colour, setColour] = useState("bg3");
  const [editOpen, setEditOpen] = useState(false);
  
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
          <FinalAvatarDisplay pose={pose} bg={colour} onClick={() => setEditOpen(true)}/>
        </div>
        <div className="text-xl font-semibold -mt-20">{userData?.username}</div>
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