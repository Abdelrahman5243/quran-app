import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAyahsIndex } from "../features/ayahsSlice";
import Selector from "./common/Selector";

const AyahSelector = () => {
  const dispatch = useDispatch();
  const { ayahsIndex, currentSurah } = useSelector((state) => state.ayahs);

  const ayahs = currentSurah?.ayahs || [];

  const handleAyahsChange = (e) => {
    dispatch(setAyahsIndex(parseInt(e.target.value) - 1));
  };

  const options = ayahs.map((_, index) => ({
    value: index + 1,
    label: `آية ${index + 1}`,
  }));

  return (
    <Selector
      id="ayahSelect"
      value={ayahsIndex + 1}
      onChange={handleAyahsChange}
      options={options}
      label="Select Ayah"
      ariaLabel="Select Ayah"
    />
  );
};

export default AyahSelector;
