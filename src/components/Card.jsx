import AyahContent from "./AyahContent";
import SurahSelector from "./SurahSelector";
import AyahSelector from "./AyahSelector";

const Card = () => {
  return (
    <div className="w-full max-w-7xl px-4 sm:px-6 md:px-12 flex justify-center items-center">
      <div className="glass-card rounded-[1.5rem] md:rounded-[2rem] flex flex-col w-full overflow-hidden transition-all duration-700 hover:shadow-emerald-500/20 group">
        <div className="flex-1 flex flex-col">
          <AyahContent />
        </div>
        <div className="px-10 md:px-16 py-6 md:py-12 border-t border-white/10">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 w-full justify-center items-center">
            <div className="w-full lg:w-1/2">
              <SurahSelector />
            </div>
            <div className="w-full lg:w-1/2">
              <AyahSelector />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
