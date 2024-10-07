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
      audio.play().catch(console.error);
    };
    const onWaiting = () => setIsLoading(true);
    const onError = (error) => {
      if (error.name !== "AbortError") {
        setIsLoading(false);
        setIsPlaying(false);
        console.error("خطأ في تحميل الصوت:", error);
      }
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
  }, [ayahAudio, surahsIndex, ayahsIndex, dispatch, handleEnded]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    setIsPlaying(false);
    setIsLoading(true);
    audioRef.current.src = ayahAudio;
  }, [surahsIndex, ayahsIndex, reader, ayahAudio]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col items-center">
      <ReaderSelector />
      <div className="flex items-center space-x-4">
        <button
          className={`w-16 h-16 flex justify-center items-center rounded-full ${
            isLoading ? "animate-spin" : ""
          }`}
          onClick={togglePlayPause}
          disabled={isLoading}
          aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
        >
          {isLoading ? (
            <i className="ri-reset-right-line text-5xl" aria-hidden="true"></i>
          ) : isPlaying ? (
            <i className="ri-pause-circle-fill text-5xl" aria-hidden="true"></i>
          ) : (
            <i className="ri-play-circle-fill text-5xl" aria-hidden="true"></i>
          )}
        </button>
      </div>
      {ayahAudio && (
        <audio ref={audioRef} src={ayahAudio} preload="metadata"></audio>
      )}
    </div>
  );
};

export default AudioPlayer;
