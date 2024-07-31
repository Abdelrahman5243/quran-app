import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { navigate } from "../features/ayahsSlice";

const AudioPlayer = () => {
  const { surahsIndex, ayahsIndex, currentSurah } = useSelector(
    (state) => state.ayahs
  );
  const ayahAudio = currentSurah?.ayahs[ayahsIndex]?.audio;

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
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [surahsIndex, ayahsIndex]);

  return (
    <div
      role="region" // Defines the region of the page for screen readers
      aria-live="polite" // Announces updates politely to assistive technologies
      aria-labelledby="audio-player-heading" // Associates with a heading for context
      className="flex flex-col items-center"
    >
      <h2 id="audio-player-heading" className="sr-only">
        Audio Player
      </h2>
      <button
        className={`w-16 h-16 flex justify-center items-center rounded-full text-gray-600 dark:text-gray-100 mx-auto ${
          isLoading ? "animate-spin" : ""
        }`}
        onClick={togglePlayPause}
        disabled={isLoading}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isLoading ? (
          <i className="ri-reset-right-line text-5xl" aria-hidden="true"></i>
        ) : isPlaying ? (
          <i className="ri-pause-circle-fill text-5xl" aria-hidden="true"></i>
        ) : (
          <i className="ri-play-circle-fill text-5xl" aria-hidden="true"></i>
        )}
      </button>

      <audio
        ref={audioRef}
        src={ayahAudio}
        preload="metadata"
        onCanPlay={handleCanPlay}
        onWaiting={handleWaiting}
        onEnded={handleEnded}
        aria-hidden="true" // Hide the default audio controls
      ></audio>
    </div>
  );
};

export default AudioPlayer;
