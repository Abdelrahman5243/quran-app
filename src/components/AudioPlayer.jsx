import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { navigate } from "../features/ayahsSlice";
import ReaderSelector from "./ReaderSelector";

const AudioPlayer = () => {
  const { surahsIndex, ayahsIndex, currentSurah, reader } = useSelector(
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
    // Skip navigation if it's the last ayah in the last surah
    if (surahsIndex === 114 && ayahsIndex === 5) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    // Pause audio and set loading state before navigation
    audioRef.current.pause();
    setIsPlaying(false);
    setIsLoading(true);

    // Navigate to the next Ayah
    dispatch(navigate({ direction: "right" }));

    // Wait for the new audio to be ready before playing
    const handleAudioReady = () => {
      setIsLoading(false);
      audioRef.current.play().catch((error) => {
        console.error("Playback failed:", error);
      });
      setIsPlaying(true);
      audioRef.current.removeEventListener("canplay", handleAudioReady);
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("canplay", handleAudioReady);
    }
  };

  useEffect(() => {
    const currentAudioRef = audioRef.current; // Copy the current ref value

    // Initial pause
    if (currentAudioRef) {
      currentAudioRef.pause();
      setIsPlaying(false);
      setIsLoading(true);
    }

    return () => {
      if (currentAudioRef) {
        // Cleanup listeners
        currentAudioRef.removeEventListener("canplay", handleCanPlay);
        currentAudioRef.removeEventListener("error", handleError);
      }
    };
  }, [surahsIndex, ayahsIndex, reader]);

  useEffect(() => {
    const currentAudioRef = audioRef.current; // Copy the current ref value

    const handleAudioReady = () => {
      setIsLoading(false);
      // Do not automatically play audio; wait for user interaction
    };

    if (currentAudioRef) {
      currentAudioRef.addEventListener("canplay", handleAudioReady);
      currentAudioRef.addEventListener("error", handleError);
    }

    // Clean up event listeners on component unmount or re-render
    return () => {
      if (currentAudioRef) {
        currentAudioRef.removeEventListener("canplay", handleAudioReady);
        currentAudioRef.removeEventListener("error", handleError);
      }
    };
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
      {ayahAudio && (
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
