import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { navigate } from "../features/ayahsSlice";

const AudioPlayer = () => {
  const { surahsIndex, ayahsIndex, surahs } = useSelector(
    (state) => state.ayahs
  );
  const ayahAudio = surahs && surahs[surahsIndex]?.ayahs[ayahsIndex]?.audio;

  const dispatch = useDispatch();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleWaiting = () => {
    setIsLoading(true);
  };

  const handleEnded = async () => {
    await dispatch(navigate({ direction: "right" }));
    audioRef.current.play();
    setIsPlaying(true);
  };

  useEffect(() => {
    audioRef.current.pause();
    setIsPlaying(false);
  }, [surahsIndex, ayahsIndex]);
  
  return (
    <>
      <button
        className={`w-16 h-16 flex justify-center items-center 
          rounded-full text-gray-600 dark:text-gray-100 mx-auto ${
            isLoading ? "animate-spin" : ""
          }`}
        onClick={togglePlayPause}
        disabled={isLoading}
      >
        {isLoading ? (
          <i className="ri-reset-right-line text-5xl"></i>
        ) : isPlaying ? (
          <i className="ri-pause-circle-fill text-5xl"></i>
        ) : (
          <i className="ri-play-circle-fill text-5xl"></i>
        )}
      </button>

      <audio
        ref={audioRef}
        src={ayahAudio}
        onCanPlay={handleCanPlay}
        onWaiting={handleWaiting}
        onEnded={handleEnded}
      ></audio>
    </>
  );
};

export default AudioPlayer;
