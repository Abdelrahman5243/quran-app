import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { navigate } from "../features/ayahsSlice";
import ReaderSelector from "./ReaderSelector";

const AudioPlayer = () => {
  const { surahsIndex, ayahsIndex, currentSurah } = useSelector(
    (state) => state.ayahs
  );
  const ayahAudio = currentSurah?.ayahs[ayahsIndex]?.audio;
  const dispatch = useDispatch();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  const handleEnded = () => {
    if (surahsIndex === 114 && ayahsIndex === (currentSurah?.ayahs.length - 1)) {
      setIsPlaying(false);
      return;
    }
    dispatch(navigate({ direction: "right" }));
  };

  const handleNext = useCallback(() => {
    dispatch(navigate({ direction: "right" }));
  }, [dispatch]);

  const handlePrev = useCallback(() => {
    dispatch(navigate({ direction: "left" }));
  }, [dispatch]);

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
    <div className="flex flex-col items-center gap-8 mt-10 w-full max-w-4xl mx-auto px-4">
      <div className="w-full max-w-sm transition-all duration-500 transform hover:scale-105">
        <ReaderSelector />
      </div>

      <div className="flex items-center justify-center gap-10 md:gap-16">
        <button
          className="glass-button w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full text-emerald-600 dark:text-emerald-400 hover:scale-110 active:scale-95 shadow-lg group"
          onClick={handlePrev}
          aria-label="الآية السابقة"
          title="الآية السابقة"
        >
          <i className="ri-arrow-right-s-line text-3xl md:text-4xl group-hover:translate-x-1 transition-transform" aria-hidden="true"></i>
        </button>

        <button
          className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 flex justify-center items-center rounded-full bg-emerald-500 text-white shadow-2xl shadow-emerald-500/40 transition-all duration-300 transform hover:scale-110 active:scale-95 disabled:bg-emerald-300 relative group"
          onClick={togglePlayPause}
          disabled={isLoading}
          aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
        >
          <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20 group-hover:opacity-40 transition-opacity"></div>
          {isLoading ? (
            <i className="ri-loader-2-line animate-spin text-5xl md:text-6xl" aria-hidden="true"></i>
          ) : isPlaying ? (
            <i className="ri-pause-fill text-5xl md:text-6xl" aria-hidden="true"></i>
          ) : (
            <i className="ri-play-fill text-5xl md:text-6xl ml-2" aria-hidden="true"></i>
          )}
        </button>

        <button
          className="glass-button w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full text-emerald-600 dark:text-emerald-400 hover:scale-110 active:scale-95 shadow-lg group"
          onClick={handleNext}
          aria-label="الآية التالية"
          title="الآية التالية"
        >
          <i className="ri-arrow-left-s-line text-3xl md:text-4xl group-hover:-translate-x-1 transition-transform" aria-hidden="true"></i>
        </button>
      </div>

      {ayahAudio && <audio ref={audioRef} preload="metadata"></audio>}
    </div>
  );
};

export default AudioPlayer;
