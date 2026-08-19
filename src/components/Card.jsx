import { useSelector } from "react-redux";
import AyahContent from "./AyahContent";
import SurahSelector from "./SurahSelector";
import AyahSelector from "./AyahSelector";
import ReaderSelector from "./ReaderSelector";
import AudioPlayer from "./AudioPlayer";

const Card = () => {
  const { currentSurah, ayahsIndex } = useSelector((state) => state.ayahs);
  const total = currentSurah?.ayahs?.length ?? 0;

  return (
    <div className="surface-card w-full overflow-hidden">
      {/* Slim control row: pickers stay inline so the verse keeps the height. */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-line/[0.07] px-3 py-2.5 sm:justify-between sm:px-4">
        <div className="w-[10.5rem]">
          <SurahSelector />
        </div>
        <div className="w-[8rem]">
          <AyahSelector />
        </div>
        <div className="w-[11rem]">
          <ReaderSelector />
        </div>
      </div>

      <AyahContent />

      {/* Transport sits with the verse it controls. */}
      <div className="flex items-center justify-between gap-4 border-t border-line/[0.07] px-4 py-3">
        <span className="t-meta shrink-0 tabular-nums text-ink-3" dir="ltr">
          {total > 0 ? `${ayahsIndex + 1} / ${total}` : "—"}
        </span>
        <AudioPlayer />
        <span className="w-12 shrink-0" aria-hidden="true" />
      </div>
    </div>
  );
};

export default Card;
