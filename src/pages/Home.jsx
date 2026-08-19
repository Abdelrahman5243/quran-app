import { useEffect } from "react";
import Card from "../components/Card";
import InfoRow from "../components/InfoRow/InfoRow";
import PrayerTimes from "../components/PrayerTimes/PrayerTimes";

const Home = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-6 sm:px-6 sm:py-10">
      <Card />
      <PrayerTimes />
      <InfoRow />
    </div>
  );
};

export default Home;
