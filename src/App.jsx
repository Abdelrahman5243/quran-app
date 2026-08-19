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
    <div className="relative flex min-h-screen flex-col">
      {/*
        The photograph is atmosphere, not content. It sits in a fixed layer
        behind a scrim that flattens its contrast, so cards above it stay
        legible over both the bright sky and the dark arches.
      */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 bg-surface-2" />
      <div
        aria-hidden="true"
        className="bg-photo pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'image-set(url("/islamic-bg.webp") 1x, url("/islamic-bg.webp") 2x)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-surface-2/[0.35] dark:bg-dark-1/[0.55]"
      />

      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/athkar/:type?" element={<AthkarPage />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
