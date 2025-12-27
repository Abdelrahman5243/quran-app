import { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL_ATHKAR;
import AthkarCard from "../components/AthkarCard/AthkarCard";

const AthkarPage = () => {
  const [athkar, setAthkar] = useState([]);
  const [selectedAthkar, setSelectedAthkar] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getAthkar = async () => {
    setIsLoading(true);
    const cachedAthkar = localStorage.getItem("athkar");
    if (cachedAthkar) {
      setAthkar(JSON.parse(cachedAthkar));
    } else {
      try {
        const res = await fetch(`${apiUrl}`);
        const data = await res.json();
        const athkarData = [data["أذكار الصباح"], data["أذكار المساء"]];
        setAthkar(athkarData);
        localStorage.setItem("athkar", JSON.stringify(athkarData));
      } catch (error) {
        console.error("Error fetching athkar:", error);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAthkar();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 flex flex-col items-center">
      {/* Tab Switcher */}
      <div className="glass-card flex p-1.5 rounded-2xl mb-12 animate-fade-in shadow-xl">
        <button
          className={`px-8 py-3 rounded-xl transition-all duration-500 font-bold text-lg ${
            selectedAthkar === 0
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
              : "text-slate-600 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
          }`}
          onClick={() => setSelectedAthkar(0)}
        >
          أذكار الصباح
        </button>
        <button
          className={`px-8 py-3 rounded-xl transition-all duration-500 font-bold text-lg ${
            selectedAthkar === 1
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
              : "text-slate-600 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
          }`}
          onClick={() => setSelectedAthkar(1)}
        >
          أذكار المساء
        </button>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="mt-20 flex flex-col items-center gap-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-xl font-bold text-slate-500 dark:text-slate-400">جاري تحميل الأذكار...</p>
        </div>
      ) : (
        <div className="w-full max-w-5xl flex flex-col gap-8 animate-fade-in px-2 md:px-0">
          {athkar[selectedAthkar]?.map((athkarItem, index) => (
            <AthkarCard
              key={`${index}-${athkarItem.category}`}
              content={athkarItem.content}
              count={+athkarItem.count}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AthkarPage;
