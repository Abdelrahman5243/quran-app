import NavigationButtons from "./NavigationButtons";
import AyahContent from "./AyahContent";
import SurahSelector from "./SurahSelector";
import AyahSelector from "./AyahSelector";

const Card = () => {
  return (
    <div className="container p-4 flex justify-between items-center">
      <NavigationButtons>
        <div className="card ring-2 ring-gray-200 dark:ring-0 text-center bg-light-2 rounded-lg dark:bg-dark-2 flex flex-col w-full font-medium text-xl md:text-3xl">
          <AyahContent />
          <div className="select p-5 flex flex-wrap justify-between gap-4 flex-col sm:flex-row">
            <SurahSelector />
            <AyahSelector />
          </div>
        </div>
      </NavigationButtons>
    </div>
  );
};

export default Card;
