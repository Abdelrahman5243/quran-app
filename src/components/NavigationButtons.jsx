import React from "react";
import { useDispatch } from "react-redux";
import { navigate } from "../features/ayahsSlice";

const NavigationButtons = ({ children }) => {
  const dispatch = useDispatch();

  const leftMove = () => {
    dispatch(navigate({ direction: "left" }));
  };

  const rightMove = () => {
    dispatch(navigate({ direction: "right" }));
  };

  return (
    <>
      <button className="cursor-pointer text-xl" onClick={leftMove}>
        <i className="ri-arrow-left-wide-fill"></i>
      </button>

      {children}

      <button className="cursor-pointer text-xl" onClick={rightMove}>
        <i className="ri-arrow-right-wide-fill"></i>
      </button>
    </>
  );
};

export default NavigationButtons;
