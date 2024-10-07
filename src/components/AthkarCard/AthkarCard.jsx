import { useState, useCallback, useMemo } from "react";

const AthkarCard = ({ content, count }) => {
  const [currentCount, setCurrentCount] = useState(count);

  const countDown = useCallback(() => {
    if (currentCount > 0) {
      setCurrentCount((prevCount) => prevCount - 1);
    }
  }, [currentCount]);

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
    () => `flex justify-between items-center p-4 bg-light-2 dark:bg-dark-2 rounded-lg cursor-pointer transition-colors duration-300 hover:bg-light-1 
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
    >
      <p className="text-dark-1 dark:text-light-1">{content}</p>
      <p className="text-dark-1 dark:text-light-1 font-bold text-xl px-4 select-none">
        {currentCount}
      </p>
    </div>
  );
};

export default AthkarCard;
