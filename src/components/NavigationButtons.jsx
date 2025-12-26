import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { navigate } from "../features/ayahsSlice";

const NavigationButtons = ({ children }) => {
  const dispatch = useDispatch();

  // Use useCallback to memoize the handlers and prevent unnecessary re-renders
  const leftMove = useCallback(() => {
    dispatch(navigate({ direction: "left" }));
  }, [dispatch]);

  const rightMove = useCallback(() => {
    dispatch(navigate({ direction: "right" }));
  }, [dispatch]);

  return (
    <div className="flex justify-center w-full items-center gap-4">
      <button
        className="cursor-pointer w-14 h-14 flex-shrink-0 flex items-center justify-center text-3xl rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all duration-300"
        onClick={rightMove}
        aria-label="Navigate right"
      >
        <i className="ri-arrow-right-s-line" aria-hidden="true"></i>
      </button>

      <div className="flex-1 max-w-4xl">
        {children}
      </div>

      <button
        className="cursor-pointer w-14 h-14 flex-shrink-0 flex items-center justify-center text-3xl rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all duration-300"
        onClick={leftMove}
        aria-label="Navigate left"
      >
        <i className="ri-arrow-left-s-line" aria-hidden="true"></i>
      </button>
    </div>
  );
};

export default NavigationButtons;
