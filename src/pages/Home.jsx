import Card from "../components/Card";
import AudioPlayer from "../components/AudioPlayer";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
      <Card />
      <AudioPlayer />
    </main>
  );
};

export default Home;
