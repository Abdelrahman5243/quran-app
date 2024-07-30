import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSurahsIndex, setAyahsIndex } from "../features/ayahsSlice";

const OptionSelectors = () => {
  const dispatch = useDispatch();
  const { surahsIndex, ayahsIndex, surahs } = useSelector(
    (state) => state.ayahs
  );

  const ayahs = surahs?.[surahsIndex]?.ayahs || [];

  return (
    <div className="select p-5 w-full flex justify-between">
      <div className="flex items-center">
        <select
          id="souraSelect"
          className="text-center"
          value={surahsIndex}
          onChange={(e) => {
            dispatch(setSurahsIndex(parseInt(e.target.value)));
            dispatch(setAyahsIndex(0));
          }}
        >
          {surahs?.map((surah, index) => (
            <option key={index} value={index}>
              {surah.name}
            </option>
          ))}
        </select>
        <i className="ri-arrow-down-s-fill ml-2"></i>
      </div>

      <div className="flex items-center">
        <select
          id="ayahSelect"
          className="text-center"
          value={ayahsIndex + 1}
          onChange={(e) =>
            dispatch(setAyahsIndex(parseInt(e.target.value) - 1))
          }
        >
          {ayahs.map((ayah, index) => (
            <option key={index} value={index + 1}>
              {`آية ${index + 1}`}
            </option>
          ))}
        </select>
        <i className="ri-arrow-down-s-fill ml-2"></i>
      </div>
    </div>
  );
};

export default OptionSelectors;
