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
      `flex justify-between items-center gap-8 p-4 bg-light-2 dark:bg-dark-2 rounded-lg cursor-pointer transition-colors duration-300 hover:bg-light-1 
      dark:hover:bg-dark-1 outline-none ${
        currentCount === 0
          ? "border-2 border-green-500"
          : "border-2 dark:border-dark-2 border-light-2"
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
      <p className="text-dark-1 dark:text-light-1">{content}</p>
      <div className="flex flex-col gap-4 items-center bg-light-1 dark:bg-dark-1 p-2 rounded min-w-24">
        <p className="text-dark-1 dark:text-light-1 font-bold text-xl px-4 select-none">
          {currentCount}
        </p>
        <div className="flex justify-between w-full items-center">
          <p className="text-dark-1 dark:text-light-1 opacity-20 font-bold text-xl select-none">
            {count}
          </p>
          <button
            onClick={countReset}
            onKeyDown={(e) => e.key === "Enter" && countReset(e)}
            tabIndex={0}
            aria-label="Reset counter"
            className="text-dark-1 dark:text-light-1 opacity-75 hover:opacity-100 focus:outline-none"
          >
            <i className="ri-arrow-go-forward-line"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AthkarCard;
