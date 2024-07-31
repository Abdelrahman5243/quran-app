import React from "react";
import NavigationButtons from "./NavigationButtons";
import AyahContent from "./AyahContent";
import OptionSelectors from "./OptionSelectors";

const Card = () => {
  return (
    <div className="container p-4 flex justify-between items-center">
      <NavigationButtons>
        <div className="card ring-2 ring-gray-200 dark:ring-0 text-center bg-light-2 rounded-lg dark:bg-dark-2 flex flex-col w-full font-medium text-2xl md:text-lg">
          <AyahContent />
          <OptionSelectors />
        </div>
      </NavigationButtons>
    </div>
  );
};

export default Card;
