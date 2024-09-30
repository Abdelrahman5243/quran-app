import { useSelector } from "react-redux";

const AyahContent = () => {
  const { ayahsIndex, currentSurah } = useSelector(
    (state) => state.ayahs
  );
  const ayahText = currentSurah?.ayahs[ayahsIndex]?.text || "No Ayah found.";

  return (
    <div className="content p-5 w-full h-auto">
      <p id="ayah-content" className="p-2 leading-loose">
        {ayahText}
      </p>
    </div>
  );
};

export default AyahContent;
