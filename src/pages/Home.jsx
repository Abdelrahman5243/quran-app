import Card from "../components/Card";
import AudioPlayer from "../components/AudioPlayer";

const Home = () => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
      <Card />
      <AudioPlayer />
    </main>
  );
};

export default Home;
