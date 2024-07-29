import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAyahs } from "./features/ayahsSlice";
import Card from "./components/Card";
import { Loader } from "./components/Loader";
import AudioPlayer from "./components/AudioPlayer";
import Footer from "./components/Footer";

function App() {
  const [mode, setMode] = useState(false);
  const dispatch = useDispatch();

  const status = useSelector((state) => state.ayahs.status);

  useEffect(() => {
    dispatch(fetchAllAyahs());
  }, []);
  if (status === "loading") {
    return <Loader />;
  }

  if (status === "failed") {
    return <div>Error loading data.</div>;
  }

  return (
    <div className={`${mode ? "" : "dark"}`}>
      <div className="min-h-screen font-tajawal bg-gray-100 dark:bg-slate-700">
        <div className="container p-4 flex justify-between items-center text-2xl text-gray-600 dark:text-gray-100 flex-row-reverse">
          <div className="font-bold select-none cursor-pointer">
            القرأن الكريم
          </div>
          <button
            className="mode_btn cursor-pointer"
            onClick={() => setMode(!mode)}
          >
            {mode ? (
              <i className="ri-sun-fill"></i>
            ) : (
              <i className="ri-moon-fill"></i>
            )}
          </button>
        </div>
        <Card />
        <AudioPlayer />
      </div>
      <Footer />
    </div>
  );
}

export default App;
