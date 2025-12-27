import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL_ATHKAR;
import AthkarCard from "../components/AthkarCard/AthkarCard";

const AthkarPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [athkar, setAthkar] = useState([]);
  const selectedAthkar = type === "evening" ? 1 : 0;
  const [isLoading, setIsLoading] = useState(true);
  
  // Daily Progress State
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem("athkarDailyProgress");
    if (saved) {
      const parsed = JSON.parse(saved);
      const today = new Date().toISOString().split("T")[0];
      // Only return if it's from today
      if (parsed.date === today) {
        return parsed.data || { morning: {}, evening: {}, lastMorningIdx: 0, lastEveningIdx: 0 };
      }
    }
    return { morning: {}, evening: {}, lastMorningIdx: 0, lastEveningIdx: 0 };
  });

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("athkarDailyProgress", JSON.stringify({
      date: today,
      data: progress
    }));
  }, [progress]);

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
    if (!type) {
      navigate('/athkar/morning', { replace: true });
    }
  }, [type]);

  // Scroll to last reached index on mount or category change
  useEffect(() => {
    if (!isLoading && athkar[selectedAthkar]) {
      const lastIdx = selectedAthkar === 0 ? progress.lastMorningIdx : progress.lastEveningIdx;
      if (lastIdx > 0) {
        setTimeout(() => {
          const element = document.getElementById(`athkar-${selectedAthkar}-${lastIdx}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      }
    }
  }, [selectedAthkar, isLoading]);

  const completedCount = useMemo(() => {
    if (!athkar[selectedAthkar]) return 0;
    const category = selectedAthkar === 0 ? 'morning' : 'evening';
    return athkar[selectedAthkar].filter((_, idx) => progress[category][idx] === 0).length;
  }, [athkar, selectedAthkar, progress]);

  const totalCount = useMemo(() => {
    return athkar[selectedAthkar]?.length || 0;
  }, [athkar, selectedAthkar]);

  const handleCountChange = useCallback((type, index, currentCount) => {
    setProgress(prev => {
      const newProgress = { ...prev };
      const category = type === 0 ? 'morning' : 'evening';
      newProgress[category] = { ...prev[category], [index]: currentCount };
      
      // Update last reached index
      if (type === 0) {
        newProgress.lastMorningIdx = Math.max(prev.lastMorningIdx, index);
      } else {
        newProgress.lastEveningIdx = Math.max(prev.lastEveningIdx, index);
      }
      
      return newProgress;
    });
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 flex flex-col items-center">
      {/* Tab Switcher */}
      <div className="glass-card flex p-1.5 rounded-2xl mb-12 animate-fade-in shadow-xl">
        <Link
          to="/athkar/morning"
          className={`px-8 py-3 rounded-xl transition-all duration-500 font-bold text-lg ${
            selectedAthkar === 0
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
              : "text-slate-600 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
          }`}
        >
          أذكار الصباح
        </Link>
        <Link
          to="/athkar/evening"
          className={`px-8 py-3 rounded-xl transition-all duration-500 font-bold text-lg ${
            selectedAthkar === 1
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
              : "text-slate-600 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
          }`}
        >
          أذكار المساء
        </Link>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="mt-20 flex flex-col items-center gap-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-xl font-bold text-slate-500 dark:text-slate-400">جاري تحميل الأذكار...</p>
        </div>
      ) : (
        <div className="w-full max-w-5xl flex flex-col gap-8 animate-fade-in px-2 md:px-0">
          {/* Progress Overview */}
          <div className="glass-card p-6 rounded-3xl mb-4 border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">إنجازك اليوم</h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold">لقد قرأت {completedCount} من أصل {totalCount}</p>
              </div>
              <div className="w-20 h-20 relative flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-slate-200 dark:text-slate-700"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeDasharray={213.6}
                    strokeDashoffset={213.6 - (213.6 * (completedCount / (totalCount || 1)))}
                    strokeLinecap="round"
                    className="text-emerald-500 transition-all duration-1000"
                  />
                </svg>
                <span className="absolute text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {Math.round((completedCount / (totalCount || 1)) * 100)}%
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000" 
                style={{ width: `${(completedCount / (totalCount || 1)) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => {
                   if(confirm('هل تريد إعادة تعيين التقدم لهذا اليوم؟')) {
                     setProgress(prev => {
                       const newProgress = { ...prev };
                       const category = selectedAthkar === 0 ? 'morning' : 'evening';
                       newProgress[category] = {};
                       if (selectedAthkar === 0) newProgress.lastMorningIdx = 0;
                       else newProgress.lastEveningIdx = 0;
                       return newProgress;
                     });
                   }
                }}
                className="text-xs font-bold text-slate-400 hover:text-emerald-500 transition-colors flex items-center gap-1"
              >
                <i className="ri-refresh-line"></i>
                إعادة تعيين التقدم
              </button>
            </div>
          </div>
          {athkar[selectedAthkar]?.map((athkarItem, index) => {
            const category = selectedAthkar === 0 ? 'morning' : 'evening';
            const savedCount = progress[category][index];
            const isLastReached = (selectedAthkar === 0 ? progress.lastMorningIdx : progress.lastEveningIdx) === index;

            return (
              <div 
                key={`${index}-${athkarItem.category}`} 
                id={`athkar-${selectedAthkar}-${index}`}
                className="relative"
              >
                {isLastReached && savedCount !== 0 && (
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-emerald-500 rounded-full hidden md:block animate-pulse"></div>
                )}
                <AthkarCard
                  content={athkarItem.content}
                  count={+athkarItem.count}
                  initialCount={savedCount !== undefined ? savedCount : +athkarItem.count}
                  onCountChange={(newCount) => handleCountChange(selectedAthkar, index, newCount)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AthkarPage;
