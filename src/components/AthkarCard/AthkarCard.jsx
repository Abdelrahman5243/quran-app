import { useState, useCallback, useMemo } from "react";

const AthkarCard = ({ content, count }) => {
  const [currentCount, setCurrentCount] = useState(count);

  const countDown = useCallback(() => {
    if (currentCount > 0) {
      setCurrentCount((prevCount) => prevCount - 1);
    }
  }, [currentCount]);

  const countReset = useCallback((event) => {
    event.stopPropagation(); // Prevent event bubbling
    setCurrentCount(count);
  }, [count]);

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
      `flex justify-between items-center gap-8 p-8 backdrop-blur-xl bg-white/40 dark:bg-black/40 rounded-[2rem] cursor-pointer transition-all duration-500 border border-white/30 dark:border-white/10 hover:bg-white/50 dark:hover:bg-black/50 hover:translate-y-[-4px] outline-none ${
        currentCount === 0
          ? "border-emerald-500/50 bg-emerald-500/10"
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
      <p className="text-dark-1 dark:text-light-1 text-lg md:text-xl leading-relaxed font-arabic flex-1">
        {content}
      </p>
      <div className="flex flex-col gap-3 items-center bg-white/40 dark:bg-black/40 backdrop-blur-sm p-4 rounded-xl min-w-28 border border-white/20">
        <p className="text-emerald-600 dark:text-emerald-400 font-bold text-3xl select-none">
          {currentCount}
        </p>
        <div className="flex items-center justify-center gap-4 w-full border-t border-emerald-500/10 pt-2">
          <p className="text-dark-1 dark:text-light-1 opacity-30 font-semibold text-lg select-none">
            {count}
          </p>
          <button
            onClick={countReset}
            onKeyDown={(e) => e.key === "Enter" && countReset(e)}
            tabIndex={0}
            aria-label="Reset counter"
            className="text-emerald-600 dark:text-emerald-400 opacity-60 hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-emerald-500/10"
          >
            <i className="ri-arrow-go-forward-line"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AthkarCard;
