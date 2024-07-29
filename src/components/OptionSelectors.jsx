import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSurahsIndex, setAyahsIndex } from "../features/ayahsSlice";

const OptionSelectors = () => {
  const dispatch = useDispatch();
  const surahsIndex = useSelector((state) => state.ayahs.surahsIndex);
  const ayahsIndex = useSelector((state) => state.ayahs.ayahsIndex);
  const surahs = useSelector((state) => state.ayahs.data?.surahs);

  const ayahs = surahs?.[surahsIndex]?.ayahs || [];

  return (
    <div className="select p-5 w-full flex justify-between">
      <select
        id="souraSelect"
        value={surahsIndex}
        onChange={(e) => dispatch(setSurahsIndex(parseInt(e.target.value)))}
      >
        {surahs?.map((surah, index) => (
          <option key={index} value={index}>
            {surah.name}
          </option>
        ))}
      </select>

      <select
        id="ayahSelect"
        value={ayahsIndex + 1}
        onChange={(e) => dispatch(setAyahsIndex(parseInt(e.target.value) - 1))}
      >
        {ayahs.map((ayah, index) => (
          <option key={index} value={index + 1}>
            {`آية ${index + 1}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OptionSelectors;
