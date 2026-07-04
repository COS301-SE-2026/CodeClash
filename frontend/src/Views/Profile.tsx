import React, { useState } from 'react';

import { type ProfileProps } from '../Models/ProfileModel';
import { useLogOut } from '../ViewModels/ProfileViewModel';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import placeholder from '../assets/Avatar/placeholder.png'
import { Button } from '@/components/ui/button';

const Profile: React.FC<ProfileProps> = ({
  username = 'User Name',
  email = 'user@codeclash.com',
  player_level = 'Level 32 - Mercury',
  current_streak = 522,
  prev_page = "/dashboard"
}) => {

  const onLogout = useLogOut();

  return (
    <div className="w-full min-h-screen bg-secondary flex flex-col items-center justify-center text-secondary-text">

      <Link className="secondary-back-button" to={prev_page}>
        ← Back
      </Link>

      <Card className="w-[40%] h-[35rem] flex items-center justify-center bg-[#F8E5DD]">

        <div className="w-[30%]" >
          <img src={placeholder} alt="placeholder-avatar" className="" />
        </div>

        <div className="text-l font-semibold ">{username}</div>

        <div className=" text-sm font-semibold ">{player_level}</div>


        <div>
          <span className="profile-info-label">Current Streak - {current_streak}</span>
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

export default Profile;