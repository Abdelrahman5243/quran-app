import { useSelector } from "react-redux";

const AyahContent = () => {
  const { ayahsIndex, currentSurah } = useSelector(
    (state) => state.ayahs
  );
  const ayahText = currentSurah?.ayahs[ayahsIndex]?.text || "No Ayah found.";

  return (
    <div className="content p-6 md:p-12 text-center flex items-center justify-center animate-fade-in">
      <p id="ayah-content" className="text-fluid-quran font-arabic text-slate-800 dark:text-slate-100 transition-all duration-700 selection:bg-emerald-500/30">
        {ayahText}
      </p>
    </div>
  );
};

export default AyahContent;
