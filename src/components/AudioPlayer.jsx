import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

const AudioPlayer = () => {
  const surahsIndex = useSelector((state) => state.ayahs.surahsIndex);
  const ayahsIndex = useSelector((state) => state.ayahs.ayahsIndex);
  const surahs = useSelector((state) => state.ayahs.data?.surahs);
  const ayahAudio = surahs && surahs[surahsIndex]?.ayahs[ayahsIndex]?.audio;

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

  useEffect(() => {
    setIsPlaying(false);
  }, [ayahsIndex]);
  return (
    <>
      <button
        className="p-4 w-full rounded-full text-gray-600 dark:text-gray-100 mx-auto text-6xl"
        onClick={togglePlayPause}
        disabled={isLoading}
      >
        {isPlaying ? (
          <i className="ri-pause-circle-fill"></i>
        ) : (
          <i className="ri-play-circle-fill"></i>
        )}
      </button>
      {isLoading && <div>Loading...</div>}
      <audio
        ref={audioRef}
        src={ayahAudio}
        onCanPlay={handleCanPlay}
        onWaiting={handleWaiting}
        onEnded={() => setIsPlaying(false)}
      ></audio>
    </>
  );
};

export default AudioPlayer;
