import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { navigate } from "../features/ayahsSlice";
import ReaderSelector from "./ReaderSelector";

const AudioPlayer = () => {
  const { surahsIndex, ayahsIndex, currentSurah, reader, status } = useSelector(
    (state) => state.ayahs
  );
  const ayahAudio = currentSurah?.ayahs[ayahsIndex]?.audio;
  const dispatch = useDispatch();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    if (!audioRef.current) return; // Check if audioRef is not null

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Playback failed:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleWaiting = () => {
    setIsLoading(true);
  };

  const handleError = () => {
    setIsLoading(false);
    setIsPlaying(false);
    console.error("Error loading audio.");
  };

  const handleEnded = async () => {
    if (surahsIndex === 114 && ayahsIndex === 5) {
      return; // Do nothing if it's the last ayah
    }

    // Pause audio and set loading state before navigation
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setIsLoading(true);
    dispatch(navigate({ direction: "right" }));

    // Wait for the new audio to be ready before playing
    const handleAudioReady = () => {
      setIsLoading(false);
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error("Playback failed:", error);
        });
        setIsPlaying(true);
        audioRef.current.removeEventListener("canplay", handleAudioReady);
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("canplay", handleAudioReady);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsLoading(true);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("canplay", handleCanPlay);
        audioRef.current.removeEventListener("error", handleError);
      }
    };
  }, [surahsIndex, ayahsIndex, reader]);

  useEffect(() => {
    if (audioRef.current) {
      const handleAudioReady = () => {
        setIsLoading(false);
      };

      audioRef.current.addEventListener("canplay", handleAudioReady);
      audioRef.current.addEventListener("error", handleError);

      // Clean up event listeners on component unmount or re-render
      return () => {
        audioRef.current.removeEventListener("canplay", handleAudioReady);
        audioRef.current.removeEventListener("error", handleError);
      };
    }
  }, [ayahAudio]);

  return (
    <div
      role="region"
      aria-live="polite"
      aria-labelledby="audio-player-heading"
      className="flex flex-col items-center"
    >
      <h2 id="audio-player-heading" className="sr-only">
        Audio Player
      </h2>
      <ReaderSelector />
      <button
        className={`w-16 h-16 flex justify-center items-center rounded-full mx-auto ${
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
      {ayahAudio && status === "succeeded" && (
        <audio
          ref={audioRef}
          src={ayahAudio}
          preload="metadata"
          onCanPlay={handleCanPlay}
          onWaiting={handleWaiting}
          onEnded={handleEnded}
          onError={handleError}
          aria-hidden="true"
        ></audio>
      )}
    </div>
  );
};

export default AudioPlayer;
