import React from "react";
import { useSelector } from "react-redux";

const AyahContent = () => {
  const { surahsIndex, ayahsIndex, surahs } = useSelector(
    (state) => state.ayahs
  );
  const ayahText =
    surahs[surahsIndex]?.ayahs[ayahsIndex]?.text || "No Ayah found.";

  return (
    <div
      className="content p-5 w-full h-auto"
      role="region" // Defines the region of the page for screen readers
      aria-live="polite" // Announces updates politely to assistive technologies
      aria-labelledby="ayah-content-heading" // Associates with a heading for context
    >
      <p id="ayah-content" className="p-2">
        {ayahText}
      </p>
    </div>
  );
};

export default AyahContent;
