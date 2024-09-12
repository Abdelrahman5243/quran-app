import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSurahsIndex, setAyahsIndex } from "../features/ayahsSlice";
import surahNames from "../staticData/surahNames";
import Selector from "./common/Selector";

const SurahSelector = () => {
  const dispatch = useDispatch();
  const { surahsIndex } = useSelector((state) => state.ayahs);

  const handleSurahsChange = (e) => {
    const selectedSurah = parseInt(e.target.value);
    dispatch(setSurahsIndex(selectedSurah));
    dispatch(setAyahsIndex(0)); // Reset Ayah index when Surah changes
  };

  const options = surahNames.map(({ number, name }) => ({
    value: number,
    label: name,
  }));

  return (
    <Selector
      id="souraSelect"
      value={surahsIndex}
      onChange={handleSurahsChange}
      options={options}
      label="Select Surah"
      ariaLabel="Select Surah"
    />
  );
};

export default SurahSelector;
