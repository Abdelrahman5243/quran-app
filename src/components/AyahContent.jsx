import { useSelector } from "react-redux";

const AyahContent = () => {
  const { ayahsIndex, currentSurah } = useSelector(
    (state) => state.ayahs
  );
  const ayahText = currentSurah?.ayahs[ayahsIndex]?.text || "No Ayah found.";

  return (
    <div className="content p-10 md:p-16 lg:p-20 text-center flex items-center justify-center min-h-[300px]">
      <p id="ayah-content" className="text-4xl md:text-5xl lg:text-6xl font-arabic leading-[1.8] md:leading-[2.2] text-slate-800 dark:text-slate-100 transition-all duration-300">
        {ayahText}
      </p>
    </div>
  );
};

export default AyahContent;
