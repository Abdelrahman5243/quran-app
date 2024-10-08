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
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  const handleEnded = () => {
    if (surahsIndex === 114 && ayahsIndex === 5) {
      setIsPlaying(false);
      return;
    }

    dispatch(navigate({ direction: "right" }));
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onCanPlay = () => {
      setIsLoading(false);
      if (isPlaying) {
        audio
          .play()
          .catch((error) => console.error("Error playing audio:", error));
      }
    };

    const onWaiting = () => setIsLoading(true);
    const onError = (error) => {
      setIsLoading(false);
      setIsPlaying(false);
      console.error("Error loading audio:", error);
    };

    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", onError);
    };
  }, [isPlaying, ayahAudio, surahsIndex, ayahsIndex, dispatch]);

  useEffect(() => {
    if (ayahAudio && audioRef.current) {
      setIsLoading(true);
      audioRef.current.src = ayahAudio;
      audioRef.current.load();
    }
  }, [ayahAudio]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <ReaderSelector />
      <div className="flex items-center space-x-4">
        <button
          className="w-16 h-16 flex justify-center items-center rounded-full"
          onClick={togglePlayPause}
          disabled={isLoading}
          aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
        >
          {isLoading ? (
            <i
              className="ri-loader-2-line animate-spin text-5xl"
              aria-hidden="true"
            ></i>
          ) : isPlaying ? (
            <i className="ri-pause-fill text-5xl" aria-hidden="true"></i>
          ) : (
            <i className="ri-play-fill text-5xl" aria-hidden="true"></i>
          )}
        </button>
      </div>
      {ayahAudio && <audio ref={audioRef} preload="metadata"></audio>}
    </div>
  );
};

export default AudioPlayer;
