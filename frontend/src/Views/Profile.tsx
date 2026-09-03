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
import "../styles/global.css"

const colours = [
  {id: "bg1", label: "Dark Pink", value: "#c0395a"},
  {id: "bg2", label: "Medium Pink", value: "#cf6d86"},
  {id: "bg3", label: "Light Pink", value: "#F8E5DD"}
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
        className="bg-white rounded-[20px] w-[80%] h-[85%] flex flex-col justify-center items-center"
      >

        <div className="w-[100%]">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={50}></X>
          </button>
        </div>

        <div className="grid grid-cols-2 justify-center gap-10 ml-[5.5%]">

          <div className="grid ml-5 grid-rows-2 justify-center mt-10">
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
                    <span className=" bg-secondary-text rounded-full">
                      <Check size={10} className="text-black"/>
                    </span>
                  )} */}
                </button>
              )))}
              </div>
          

              <div className="grid grid-cols-3 justify-center gap-2 mt-10">
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

        <div className="-ml-[25%] flex gap-40 mt-5 mb-5">

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

        <div className="w-[35%] flex items-center justify-center" >
          {/* <img src={userData?.avatar} alt="avatarImage" className="" /> */}
          <FinalAvatarDisplay pose={pose} bg={colour} vb1={170} vb2={195} onClick={() => setEditOpen(true)} leftMargin={0}/>
        </div>
        <div className="text-xl font-semibold">{userData?.username}</div>
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