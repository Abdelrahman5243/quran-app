/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSurah } from "./features/ayahsSlice";
import Card from "./components/Card";
import { Loader } from "./components/Loader";
import AudioPlayer from "./components/AudioPlayer";
import Footer from "./components/Footer";

function App() {
  const [mode, setMode] = useState(false);
  const dispatch = useDispatch();
  const { surahsIndex, status, error } = useSelector((state) => state.ayahs);

  useEffect(() => {
    dispatch(fetchSurah());
  }, [surahsIndex, dispatch]);

  const handleModeToggle = () => {
    setMode((prevMode) => !prevMode);
  };

  if (status === "loading") {
    return <Loader />;
  }

  if (status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-red-500">Error loading data: {error}</p>
      </div>
    );
  }

  return (
    <div className={`${mode ? "" : "dark"}`}>
      <div
        className="h-screen max-h-screen bg-light-1 dark:bg-dark-1
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
