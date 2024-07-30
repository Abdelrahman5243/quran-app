import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSurahsIndex, setAyahsIndex } from "../features/ayahsSlice";

const OptionSelectors = () => {
  const dispatch = useDispatch();
  const { surahsIndex, ayahsIndex, surahs } = useSelector(
    (state) => state.ayahs
  );

  const ayahs = surahs?.[surahsIndex]?.ayahs || [];

  const handleSurahsChange = (e) => {
    dispatch(setSurahsIndex(parseInt(e.target.value)));
    dispatch(setAyahsIndex(0));
  };

  const handleAyahsChange = (e) => {
    dispatch(setAyahsIndex(parseInt(e.target.value) - 1));
  };

  return (
    <div className="select p-5 w-full flex justify-between">
      <div className="flex items-center">
        <label htmlFor="souraSelect" className="sr-only">
          Select Surah
        </label>
        <select
          id="souraSelect"
          className="text-center"
          value={surahsIndex}
          onChange={handleSurahsChange}
          aria-label="Select Surah"
        >
          {surahs?.map((surah, index) => (
            <option key={index} value={index}>
              {surah.name}
            </option>
          ))}
        </select>
        <i className="ri-arrow-down-s-fill ml-2" aria-hidden="true"></i>
      </div>

      <div className="flex items-center">
        <label htmlFor="ayahSelect" className="sr-only">
          Select Ayah
        </label>
        <select
          id="ayahSelect"
          className="text-center"
          value={ayahsIndex + 1}
          onChange={handleAyahsChange}
          aria-label="Select Ayah"
        >
          {ayahs.map((ayah, index) => (
            <option key={index} value={index + 1}>
              {`آية ${index + 1}`}
            </option>
          ))}
        </select>
        <i className="ri-arrow-down-s-fill ml-2" aria-hidden="true"></i>
      </div>
    </div>
  );
};

export default OptionSelectors;
