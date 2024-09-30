import { useState, useEffect } from "react";
import Card from "./components/Card";
import AudioPlayer from "./components/AudioPlayer";
import Footer from "./components/Footer";
import { useSelector, useDispatch } from "react-redux";
import { navigate, fetchSurah } from "./features/ayahsSlice";

function App() {
  const [mode, setMode] = useState(false);
  const handleModeToggle = () => {
    setMode((prevMode) => !prevMode);
  };
  const { surahsIndex, ayahsIndex, currentSurah, reader } = useSelector(
    (state) => state.ayahs
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSurah());
  }, [dispatch, surahsIndex, reader]);

  return (
    <div className={`${mode ? "" : "dark"}`}>
      <div
        className="min-h-screen bg-light-1 dark:bg-dark-1
       flex flex-col justify-between text-dark-1 dark:text-light-2"
      >
        <header className="container p-4 flex justify-between items-center text-2xl flex-row-reverse">
          <div className="font-bold select-none cursor-pointer">
            القرأن الكريم
          </div>
          <button
            className="mode_btn cursor-pointer"
            onClick={handleModeToggle}
            aria-label={`Switch to ${mode ? "dark" : "light"} mode`}
          >
            {mode ? (
              <i className="ri-sun-fill" aria-hidden="true"></i>
            ) : (
              <i className="ri-moon-fill" aria-hidden="true"></i>
            )}
          </button>
        </header>
        <main>
          <Card />
          <AudioPlayer />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
