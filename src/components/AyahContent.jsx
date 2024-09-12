import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSurah } from "../features/ayahsSlice";
import Loader from "./Loader";

const AyahContent = () => {
  const { ayahsIndex, currentSurah } = useSelector((state) => state.ayahs);
  const ayahText = currentSurah?.ayahs[ayahsIndex]?.text || "No Ayah found.";
  const dispatch = useDispatch();
  const { surahsIndex, status, reader } = useSelector((state) => state.ayahs);

  useEffect(() => {
    dispatch(fetchSurah());
  }, [surahsIndex, reader, dispatch]);

  return (
    <div className="content p-5 w-full h-auto">
      {status === "loading" ? (
        <Loader />
      ) : (
        <p id="ayah-content" className="p-2 leading-loose">
          {ayahText}
        </p>
      )}
    </div>
  );
};

export default AyahContent;
