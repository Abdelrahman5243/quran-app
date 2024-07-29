import React from "react";
import NavigationButtons from "./NavigationButtons";
import AyahContent from "./AyahContent";
import OptionSelectors from "./OptionSelectors";

const Card = () => {
  return (
    <div className="container p-4 my-20 flex justify-between items-center">
      <div className="flex justify-center w-full items-center text-gray-600 dark:text-gray-100">
        <NavigationButtons>
          <div className="card shadow-md text-center bg-white rounded-lg dark:bg-slate-800 flex flex-col w-full font-medium text-2xl md:text-lg">
            <AyahContent />
            <OptionSelectors />
          </div>
        </NavigationButtons>
      </div>
    </div>
  );
};

export default Card;
