import React from "react";
import { useSelector } from "react-redux";

const AyahContent = () => {
  const surahsIndex = useSelector((state) => state.ayahs.surahsIndex);
  const ayahsIndex = useSelector((state) => state.ayahs.ayahsIndex);
  const surahs = useSelector((state) => state.ayahs.data?.surahs);

  const ayahText = surahs && surahs[surahsIndex]?.ayahs[ayahsIndex]?.text;

  return (
    <div className="content p-5 w-full h-auto">
      <p className="p-2 leading-10">{ayahText || "No Ayah found."}</p>
    </div>
  );
};

export default AyahContent;
