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
    <div className="flex justify-center w-full items-center text-gray-600 dark:text-gray-100">
      <button
        className="cursor-pointer text-xl px-2 py-20"
        onClick={leftMove}
        aria-label="Navigate left"
      >
        <i className="ri-arrow-left-wide-fill" aria-hidden="true"></i>
      </button>

      {children}

      <button
        className="cursor-pointer text-xl px-2 py-20"
        onClick={rightMove}
        aria-label="Navigate right"
      >
        <i className="ri-arrow-right-wide-fill" aria-hidden="true"></i>
      </button>
    </div>
  );
};

export default NavigationButtons;
