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
      const res = await fetch(`${apiUrl}`);
      const data = await res.json();
      const athkarData = [data["أذكار الصباح"], data["أذكار المساء"]];
      setAthkar(athkarData);
      localStorage.setItem("athkar", JSON.stringify(athkarData));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAthkar();
  }, []);

  return (
    <div className="container mx-auto px-6 py-6 flex flex-col items-center">
      <div className="flex gap-4 p-1.5 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-white/20 w-fit mb-8">
        <button
          className={`px-6 py-2.5 rounded-lg transition-all duration-300 font-medium ${
            selectedAthkar === 0
              ? "bg-emerald-500 text-white"
              : "text-dark-1 dark:text-light-1 hover:bg-white/10 dark:hover:bg-black/20"
          }`}
          onClick={() => setSelectedAthkar(0)}
        >
          أذكار الصباح
        </button>
        <button
          className={`px-6 py-2.5 rounded-lg transition-all duration-300 font-medium ${
            selectedAthkar === 1
              ? "bg-emerald-500 text-white"
              : "text-dark-1 dark:text-light-1 hover:bg-white/10 dark:hover:bg-black/20"
          }`}
          onClick={() => setSelectedAthkar(1)}
        >
          أذكار المساء
        </button>
      </div>
      {isLoading ? (
        <div className="mt-6 text-center text-dark-1 dark:text-light-1">
          جاري التحميل...
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {athkar[selectedAthkar].map((athkar, index) => (
            <AthkarCard
              key={`${index}-${athkar.category}`}
              content={athkar.content}
              count={+athkar.count}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AthkarPage;
