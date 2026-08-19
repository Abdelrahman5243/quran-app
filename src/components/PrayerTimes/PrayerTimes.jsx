import { useEffect, useState, useRef } from "react";
import {
  getSavedLocation,
  requestLocation,
  DEFAULT_LOCATION,
  fetchPrayerTimes,
  getPrayerState,
  formatTime,
  formatCountdown,
} from "../../utils/prayerTimes";

const PrayerTimes = () => {
  const [data, setData] = useState(null);
  const [state, setState] = useState(null);
  const [failed, setFailed] = useState(false);
  const dataRef = useRef(null);

  useEffect(() => {
    let alive = true;

    const apply = (times) => {
      if (!alive) return;
      dataRef.current = times;
      setData(times);
      setState(getPrayerState(times));
    };

    (async () => {
      // Show times immediately for the saved or default location, so the card
      // never waits on a geolocation prompt the user may never answer.
      const known = getSavedLocation() ?? DEFAULT_LOCATION;
      try {
        apply(await fetchPrayerTimes(known));
      } catch {
        if (alive) setFailed(true);
        return;
      }

      // Then refine in the background if the browser grants a real position.
      if (getSavedLocation()) return;
      const precise = await requestLocation();
      if (!precise || !alive) return;
      try {
        apply(await fetchPrayerTimes(precise));
      } catch {
        /* keep the fallback times already on screen */
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // The countdown is the point of the card, so it ticks every second.
  useEffect(() => {
    if (!data) return;
    const id = setInterval(() => {
      setState(getPrayerState(dataRef.current));
    }, 1000);
    return () => clearInterval(id);
  }, [data]);

  if (failed) return null;

  if (!state) {
    return (
      <div className="surface-card w-full p-5">
        <div className="h-4 w-28 animate-pulse rounded bg-ink/10" />
        <div className="mt-3 h-10 w-44 animate-pulse rounded bg-ink/10" />
        <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-control bg-ink/10" />
          ))}
        </div>
      </div>
    );
  }

  const { schedule, next, current, untilNext, windowProgress } = state;

  return (
    <section className="surface-card w-full overflow-hidden" aria-label="مواقيت الصلاة">
      {/* Next prayer — the one number worth reading from across the room. */}
      <div className="relative px-5 pb-5 pt-4 sm:px-6">
        {/* Elapsed share of the current prayer window, as a quiet ground. */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 end-0 -z-10 bg-brand/[0.07] transition-[width] duration-1000 ease-out"
          style={{ width: `${windowProgress * 100}%` }}
        />

        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <p className="t-label text-ink-3">
              متبقٍ على {next.name}
            </p>
            <p
              className="mt-1 text-4xl font-bold tabular-nums leading-none text-brand sm:text-5xl"
              dir="ltr"
              aria-live="off"
            >
              {formatCountdown(untilNext)}
            </p>
          </div>

          <div className="text-start">
            <p className="t-title text-ink">
              <i className={`${next.icon} me-1.5 align-[-2px]`} aria-hidden="true" />
              {next.name}
            </p>
            <p className="t-meta text-ink-3">{formatTime(next.time)}</p>
          </div>
        </div>

        {current && (
          <p className="t-meta mt-2 text-ink-3">
            أنت الآن في وقت <span className="font-semibold text-ink-2">{current.name}</span>
          </p>
        )}
      </div>

      {/* All six markers of the day. */}
      <ol className="grid grid-cols-3 border-t border-line/[0.07] sm:grid-cols-6">
        {schedule.map((prayer, i) => {
          const isNext = prayer.key === next.key;
          const isPast = !isNext && prayer.minutes < next.minutes;

          return (
            <li
              key={prayer.key}
              aria-current={isNext ? "time" : undefined}
              className={`flex flex-col items-center gap-1 border-line/[0.07] px-2 py-3 transition-colors ${
                i % 3 !== 2 ? "border-e" : ""
              } sm:border-e sm:last:border-e-0 ${i < 3 ? "border-b sm:border-b-0" : ""} ${
                isNext ? "bg-brand/10" : ""
              }`}
            >
              <i
                className={`${prayer.icon} text-base ${
                  isNext ? "text-brand" : isPast ? "text-ink-3/60" : "text-ink-3"
                }`}
                aria-hidden="true"
              />
              <span
                className={`t-label ${
                  isNext ? "font-bold text-brand" : isPast ? "text-ink-3/70" : "text-ink-2"
                }`}
              >
                {prayer.name}
              </span>
              <span
                className={`t-label tabular-nums ${
                  isNext ? "font-bold text-brand" : isPast ? "text-ink-3/60" : "text-ink-3"
                }`}
              >
                {formatTime(prayer.time)}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default PrayerTimes;
