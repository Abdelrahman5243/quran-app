import { useEffect, lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSurah } from "./features/ayahsSlice";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Loader from "./components/common/Loader";

const Home = lazy(() => import("./pages/Home"));
const AthkarPage = lazy(() => import("./pages/AthkarPage"));

function App() {
  const { surahsIndex, reader } = useSelector((state) => state.ayahs);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSurah());
  }, [dispatch, surahsIndex, reader]);

  return (
    <div
      className="min-h-screen bg-light-1 dark:bg-dark-1 flex flex-col justify-between text-dark-1 dark:text-light-2 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: 'url("/islamic-bg.png")' }}
    >
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/athkar" element={<AthkarPage />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
