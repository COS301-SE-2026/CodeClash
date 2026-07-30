import React from 'react';
import { Link } from 'react-router-dom';

import placeholder from '../assets/Avatar/placeholder.png'
import { type ProfileProps } from '../Models/ProfileModel';
import { useLogOut } from '../ViewModels/ProfileViewModel';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUser } from 'src/context/User/hooks/useUser';




const Profile: React.FC<ProfileProps> = ({
  avatarUrl = `(${placeholder})`,
  rank = '5',
  elo = 600,
  league = 'Earth',
}) => {

  const onLogout = useLogOut();
  const { username } = useUser();

  return (
    <div className="w-full min-h-screen bg-secondary flex flex-col items-center justify-center text-secondary-text">

      <Link className="secondary-back-button font-semibold" to={'/dashboard'}
        onKeyDown={(e) => {
          const shift = e.shiftKey;
          if (shift && e.key === 'Esc') {
            nav('/dashboard');
          }
        }}
      >
        ← Back
      </Link>

      <Card className="w-[40%] h-[35rem] flex items-center justify-center bg-[#F8E5DD]">

        <div className="w-[35%]" >
          <img src={avatarUrl} className="" />
        </div>
        <div className="text-xl font-semibold ">{username}</div>
        <div className=" text-md font-semibold ">ELO - {elo}</div>
        <div className="text-md font-semibold">League - {league}</div>
        <div>
          <p className="text-[1.5rem] ">Current Rank - {rank}</p>
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