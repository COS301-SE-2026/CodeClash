import { useEffect } from "react";
import { playMusic, stopMusic, type Track } from "./audio";

export const useMusic = (track: Track) => {
    useEffect(() => {
        playMusic(track);
        return () => stopMusic();
    }, [track]);
};