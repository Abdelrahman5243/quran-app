import { useState, useCallback, useMemo, useEffect } from "react";

const AthkarCard = ({ content, count, initialCount, onCountChange }) => {
  const [currentCount, setCurrentCount] = useState(initialCount ?? count);

  // Update internal state if external initialCount changes (e.g. daily reset)
  useEffect(() => {
    setCurrentCount(initialCount ?? count);
  }, [initialCount, count]);

  const countDown = useCallback(() => {
    if (currentCount > 0) {
      const nextCount = currentCount - 1;
      setCurrentCount(nextCount);
      onCountChange?.(nextCount);
    }
  }, [currentCount, onCountChange]);

  const countReset = useCallback((event) => {
    event.stopPropagation();
    setCurrentCount(count);
    onCountChange?.(count);
  }, [count, onCountChange]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        countDown();
      }
    },
    [countDown]
  );

  const cardClasses = useMemo(
    () =>
      `glass-card flex flex-col md:flex-row justify-between items-center gap-8 p-8 rounded-[2.5rem] cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:shadow-emerald-500/20 active:scale-[0.98] outline-none group ${
        currentCount === 0
          ? "border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-500/20 shadow-lg shadow-emerald-500/5"
          : "hover:border-emerald-500/30"
      }`,
    [currentCount]
  );

  return (
    <div
      onClick={countDown}
      onKeyDown={handleKeyDown}
      className={cardClasses}
      tabIndex={0}
      aria-label="Athkar card"
    >
      {/* Arabic Text Section */}
      <div className="flex-1 text-right">
        <p className={`text-slate-800 dark:text-slate-100 text-xl md:text-2xl lg:text-3xl leading-relaxed font-arabic transition-all duration-700 ${currentCount === 0 ? 'opacity-60' : ''}`}>
          {content}
        </p>
      </div>

      {/* Counter Box Section */}
      <div className="shrink-0 mt-4 md:mt-0 relative">
        <div 
          className="w-[130px] md:w-[150px] bg-white/70 dark:bg-black/60 border border-white/40 dark:border-white/10 rounded-[2.2rem] shadow-xl overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:shadow-emerald-500/10"
          style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
        >
          <div className="py-6 flex flex-col items-center justify-center">
            <span className="text-[10px] uppercase tracking-widest text-emerald-600/70 dark:text-emerald-400/70 font-black mb-1">المتبقي</span>
            <p className={`text-5xl md:text-6xl font-bold transition-all duration-500 ${currentCount === 0 ? 'text-emerald-500 scale-110' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {currentCount === 0 ? <i className="ri-check-line"></i> : currentCount}
            </p>
          </div>
          
          <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>

          <div className="px-4 py-4 flex items-center justify-between bg-black/5 dark:bg-black/20">
            <button
              onClick={countReset}
              onKeyDown={(e) => e.key === "Enter" && countReset(e)}
              tabIndex={0}
              aria-label="إعادة الضبط"
              title="إعادة الضبط"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-sm"
            >
              <i className="ri-refresh-line text-lg"></i>
            </button>
            
            <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase text-slate-400 dark:text-slate-500 font-bold">العدد</span>
              <p className="text-slate-600 dark:text-slate-300 font-black text-lg">{count}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Progress Dots */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1 bg-white/50 dark:bg-black/40 rounded-full backdrop-blur-md border border-white/20 shadow-sm transition-all duration-500 group-hover:-bottom-4">
          {Array.from({ length: Math.min(count, 5) }).map((_, i) => {
            const progress = (count - currentCount) / (count / Math.min(count, 5));
            return (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-700 ${
                  i < progress
                    ? "w-4 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                    : "w-1.5 bg-slate-300 dark:bg-slate-700"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AthkarCard;
