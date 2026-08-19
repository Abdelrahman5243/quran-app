import { useSelector } from "react-redux";

const AyahContent = () => {
  const { ayahsIndex, currentSurah } = useSelector((state) => state.ayahs);
  const ayah = currentSurah?.ayahs?.[ayahsIndex];

  if (!ayah) {
    return (
      <div className="flex min-h-[10rem] items-center justify-center px-6 py-10">
        <p className="t-body text-ink-3">لم يتم العثور على الآية.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[10rem] items-center justify-center px-6 py-10 sm:px-10 sm:py-12">
      <p
        id="ayah-content"
        key={`${currentSurah?.number}-${ayahsIndex}`}
        className="t-verse measure-verse animate-rise text-balance font-verse text-ink"
      >
        {ayah.text}
      </p>
    </div>
  );
};

export default AyahContent;
