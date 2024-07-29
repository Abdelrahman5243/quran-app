import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSurahsIndex, setAyahsIndex } from "../features/ayahsSlice";

const NavigationButtons = ({ children }) => {
  const dispatch = useDispatch();
  const surahsIndex = useSelector((state) => state.ayahs.surahsIndex);
  const ayahsIndex = useSelector((state) => state.ayahs.ayahsIndex);
  const surahs = useSelector((state) => state.ayahs.data?.surahs);

  const leftMove = () => {
    if (surahs) {
      if (ayahsIndex > 0) {
        dispatch(setAyahsIndex(ayahsIndex - 1));
      } else if (surahsIndex > 0) {
        dispatch(setSurahsIndex(surahsIndex - 1));
        const previousSurah = surahs[surahsIndex - 1];
        if (previousSurah) {
          dispatch(setAyahsIndex(previousSurah.ayahs.length - 1));
        }
      }
    }
  };

  const rightMove = () => {
    if (surahs) {
      const currentSurah = surahs[surahsIndex];
      if (currentSurah) {
        if (ayahsIndex < currentSurah.ayahs.length - 1) {
          dispatch(setAyahsIndex(ayahsIndex + 1));
        } else if (surahsIndex < surahs.length - 1) {
          dispatch(setSurahsIndex(surahsIndex + 1));
          dispatch(setAyahsIndex(0));
        }
      }
    }
  };

  return (
    <>
      <button className="cursor-pointer text-xl" onClick={leftMove}>
        <i className="ri-arrow-left-wide-fill"></i>
      </button>

      {children}

      <button className="cursor-pointer text-xl" onClick={rightMove}>
        <i className="ri-arrow-right-wide-fill"></i>
      </button>
    </>
  );
};

export default NavigationButtons;
