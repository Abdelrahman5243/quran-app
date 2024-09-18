import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSurah } from "../features/ayahsSlice";

const AyahContent = () => {
  const { ayahsIndex, currentSurah, surahsIndex, reader } = useSelector(
    (state) => state.ayahs
  );
  const ayahText = currentSurah?.ayahs[ayahsIndex]?.text || "No Ayah found.";
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSurah());
  }, [dispatch, surahsIndex, reader]);

  return (
    <div className="content p-5 w-full h-auto">
      <p id="ayah-content" className="p-2 leading-loose">
        {ayahText}
      </p>
    </div>
  );
};

export default AyahContent;
