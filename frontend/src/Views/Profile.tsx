import { Link } from 'react-router-dom';
import { useUser } from 'src/context/User/hooks/useUser';
import { useState } from 'react';
import { useLogOut, getProfile  } from '../ViewModels/ProfileViewModel';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Stand } from 'src/animations/poses/rig';
import { Peace } from 'src/animations/poses/peace';
import { Okay } from 'src/animations/poses/okay';
import { Thinking } from 'src/animations/poses/thinking';
import {X, Check} from "lucide-react"
import Starfield from '@/components/ui/animations/Starfield';
import Confetti from '@/components/ui/animations/Confetti';
import GlassCard from '@/components/shared/GlassCard';
import { ChevronLeft } from 'lucide-react';
import "../styles/global.css"

const colours = [
  {id: "bg1", label: "Dark Pink", value: "#580e21"},
  {id: "bg2", label: "Medium Pink", value: "#C0395A"},
  {id: "bg3", label: "Light Pink", value: "#a14f6a"}
]

const poses = [
  {id: "rig", label: "Original", preview: Stand},
  {id: "okay", label: "Okay", preview: Okay},
  {id: "peace", label: "Peace", preview: Peace},
  {id: "thinking", label: "Thinking", preview: Thinking}
];

function FinalAvatarDisplay({pose, bg, onClick, vb1, vb2, leftMargin}){
  
  const poseData = poses.find((p) => p.id === pose) ?? poses[0];
  const bgData = colours.find((c) => c.id === bg)?? colours[0];

  return(
    <button
      onClick={onClick}
      style={{ backgroundColor: bgData.value}}
      className={`w-[80%] rounded-[20px] ml-${leftMargin}`}
    >
      
        <span   
          className="flex items-center justify-center w-[100%] h-[100%] mt-2">
          <poseData.preview vb1={vb1} vb2={vb2}/>
        </span>

        <div className="w-[100%] h-[100%]">
        {/* <span className="opacity-0 hover:opacity-100 transition-opacity font-font font-semibold text-secondary-text text-md">
          Edit
        </span> */}
        </div>
      
    </button>
  )
}

function AvatarPicker({currentPose, currentColour, onClose, onSave}) {
  const [selectedPose, setSelectedPose] = useState(currentPose);
  const [selectedColour, setSelectedColour] = useState(currentColour);

  const bgData = colours.find((c) => c.id === selectedColour) ?? colours[2];

  return(

    //the below motion.div is an overlay background for the entire screen for when the popup appears, it has a dimming effect

    <motion.div
      initial={{ opacity: 0}}
      animate={{ opacity: 1}}
      exit={{opacity: 0}}
      className="fixed inset-0 w-full min-h-screen bg-black/50 items-center flex justify-center" //fixed inset-0 allows overlay to be over page and not come underneath the previous parts of the page
      onClick={onClose}
    >

      <motion.div
        initial={{opacity: 0, scale: 0.95, y: 10}}
        animate={{ opacity: 1, scale: 1, y: 0}}
        exit={{ opacity: 0, scale: 0.95, y:10}}
        transition={{duration: 0.18, ease: "easeOut"}}
        onClick={(e) => e.stopPropagation()} //stops a user from repeatedly clicking on final avatar display to pull up a new popup
        className="bg-[#141414]/10 backdrop-blur-sm border border-white/30 rounded-[20px] w-[80%] h-[85%] flex flex-col justify-center items-center"
      >

        <div className="w-[100%]">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 mt-5 ml-3">
            <X size={50}></X>
          </button>
        </div>

        <div className="grid grid-cols-2 justify-center gap-10 ml-[5.5%] -mb-15 -mt-5">

          <div className="grid ml-5 grid-rows-2 justify-center mt-7">
            <div className="grid grid-cols-4 justify-center gap-10 mb-3">
              {poses.map((pose => (
                <button
                  key={pose.id}
                  onClick={() => setSelectedPose(pose.id)}
                  style={{ backgroundColor: bgData.value }}
                  className={`rounded-full flex items-center transition-all w-[110%]
                    ${selectedPose === pose.id ? "" : "opacity-70 hover:opacity-100"}`}
                    title={pose.label}
                >
                  <pose.preview vb1={170} vb2={210}/>

                  {/* below is to add a check mark by the selected pose but it looks wonky and i don't have time to fix it for now */}
                  
                  {/* {selectedPose === pose.id && (
                    <span className="absolute top-30 bg-secondary-text rounded-full">
                      <Check size={10} className="text-black"/>
                    </span>
                  )} */}
                </button>
              )))}
              </div>
          

              <div className="grid grid-cols-3 justify-center gap-2 mt-8 mb-4">
                {colours.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColour(c.id)}
                    style={{ backgroundColor: c.value}}
                    className={`rounded-full flex items-center transition-transform h-[70%] w-[80%] mt-5 ml-6
                      ${selectedColour === c.id ? "" : "opacity-70 hover:opacity-100"}`}
                      title={c.label}
                  >
                      {/* {c.value} */}
                  </button>
                ))}
              
            </div>
          </div>


          <div className="items-center ml-10">
          <FinalAvatarDisplay pose={selectedPose} bg={selectedColour} vb1={170} vb2={200} onClick={() => {}} leftMargin={10}/>
          </div>

        </div>

        <div className="-ml-[65%] flex gap-40 mt-10 mb-15">

          <Button
            onClick={onClose}
            className="w-[80%]"
          >
            Cancel
          </Button>

          
          <Button
            onClick={() => onSave(selectedPose, selectedColour)}
            className="w-[80%]"
          >
            Save
          </Button>

        </div>

      </motion.div>


    </motion.div>



  );
}


function ProfileView(){

  //local storage for demo, will be updated to being controlled by backend endpoints per user
  const [pose, setPose] = useState(() => localStorage.getItem("avatarPose") ?? "rig");
  const [colour, setColour] = useState(() => localStorage.getItem("avatarColour") ?? "bg3");
  const [editOpen, setEditOpen] = useState(false);
  
  const { userData, loadingData, error} = getProfile();

  const onLogout = useLogOut();

  if(loadingData) return <div className="font-font font-semibold text-color-button-primary">Loading Data</div>;
  

  if(error) return <div className="font-font font-semibold, text-color-button-primary">Error loading user data</div>;


  return (
    <div className="w-full min-h-screen bg-primary-dark flex flex-col items-center justify-center text-secondary-text">
      <Link className="badge badge-status-pending ml-2" to={'/dashboard'}
        onKeyDown={(e) => {
          const shift = e.shiftKey;
          if (shift && e.key === 'Esc') {
            // nav('/dashboard');
          }
        }}
      > 
      <ChevronLeft/>
      Back
      
      </Link>

        <div className="flex items-center w-[25%] mb-10 ml-4" >
          {/* <img src={userData?.avatar} alt="avatarImage" className="" /> */}
          <FinalAvatarDisplay pose={pose} bg={colour} vb1={170} vb2={195} onClick={() => setEditOpen(true)} leftMargin={10}/>
        </div>

        <Starfield/>

        <div className='card-glow w-[50%] h-[70%] grid grid-rows-2 items-center justify-center'>
        <p className="eyebrow text-center text-md mt-5 [text-shadow:0px_0px_12px_#D6405B]">{userData?.username}</p>
        <p className="eyebrow text-center text-sm [text-shadow:0px_0px_12px_#c0395a80] mt-2">ELO</p>
        <p className="score-display text-center text-sm -mt-2">{userData?.elo}</p>
        <div className="text-md font-semibold text-center uppercase text-primary-text mt-5">{userData?.league}</div>
        <div>
          <p className="text-[1.5rem] text-center uppercase font-semibold text-primary-text mb-7">Current Rank - {userData?.rank}</p>
        </div>

        <div className="profile-divider" />

        <Button
          variant={"default"}
          type="button"
          onClick={onLogout}
          className="w-[100%] py-5 mx-auto mb-6"
        >
          Log Out
        </Button>

      </div>

        <AnimatePresence>
          {editOpen && (
            <AvatarPicker
              currentPose={pose}
              currentColour={colour}
              onClose={() => setEditOpen(false)}
              onSave={(newPose, newColour) => {
                setPose(newPose);
                setColour(newColour);
                localStorage.setItem("avatarPose", newPose);
                localStorage.setItem("avatarColour", newColour);
                setEditOpen(false);
              }}
            />
          )}
        </AnimatePresence>

    </div>
  );
};

const Profile = () => {
  return <ProfileView/>;
}

export default Profile;