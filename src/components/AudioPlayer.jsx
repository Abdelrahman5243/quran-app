import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { navigate } from "../features/ayahsSlice";

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
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-full text-ink-2 transition-colors hover:bg-brand/10 hover:text-brand active:scale-95"
        onClick={handlePrev}
        aria-label="الآية السابقة"
        title="الآية السابقة"
      >
        <i className="ri-skip-back-fill text-xl rotate-180" aria-hidden="true" />
      </button>

      <button
        type="button"
        className="grid h-12 w-12 place-items-center rounded-full bg-brand text-white transition-all duration-200 ease-out hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={togglePlayPause}
        disabled={isLoading}
        aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
      >
        {isLoading ? (
          <i className="ri-loader-2-line animate-spin text-xl" aria-hidden="true" />
        ) : isPlaying ? (
          <i className="ri-pause-fill text-xl" aria-hidden="true" />
        ) : (
          <i className="ri-play-fill -me-0.5 text-xl" aria-hidden="true" />
        )}
      </button>

      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-full text-ink-2 transition-colors hover:bg-brand/10 hover:text-brand active:scale-95"
        onClick={handleNext}
        aria-label="الآية التالية"
        title="الآية التالية"
      >
        <i className="ri-skip-forward-fill text-xl rotate-180" aria-hidden="true" />
      </button>

      <audio ref={audioRef} preload="metadata" />
    </div>
  );
};

export default AudioPlayer;
