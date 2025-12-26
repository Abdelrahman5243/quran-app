import NavigationButtons from "./NavigationButtons";
import AyahContent from "./AyahContent";
import SurahSelector from "./SurahSelector";
import AyahSelector from "./AyahSelector";

const Card = () => {
  return (
    <div className="w-full max-w-5xl p-4 flex justify-between items-center">
      <NavigationButtons>
        <div className="card backdrop-blur-xl bg-white/40 dark:bg-black/40 border border-white/30 dark:border-white/10 rounded-[2.5rem] flex flex-col w-full overflow-hidden transition-all duration-500 hover:bg-white/50 dark:hover:bg-black/50">
          <div className="flex-1 flex flex-col">
            <AyahContent />
          </div>
          <div className="p-8 bg-white/20 dark:bg-black/20 backdrop-blur-md flex flex-wrap justify-center gap-6 border-t border-white/20 dark:border-white/10">
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
              <SurahSelector />
              <AyahSelector />
            </div>
          </div>
        </div>
      </NavigationButtons>
    </div>
  );
};

export default Card;
