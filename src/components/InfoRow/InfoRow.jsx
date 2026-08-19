import { useEffect, useState } from "react";
import {
  fetchHijriToday,
  fetchNextOccasion,
  formatGregorian,
} from "../../utils/hijri";

const Tile = ({ children }) => (
  <section className="surface-card flex items-center gap-4 p-4 sm:p-5">
    {children}
  </section>
);

const Skeleton = () => (
  <Tile>
    <div className="h-12 w-12 shrink-0 animate-pulse rounded-control bg-ink/10" />
    <div className="min-w-0 flex-1 space-y-2">
      <div className="h-3 w-20 animate-pulse rounded bg-ink/10" />
      <div className="h-4 w-36 animate-pulse rounded bg-ink/10" />
    </div>
  </Tile>
);

const InfoRow = () => {
  const [hijri, setHijri] = useState(null);
  const [next, setNext] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const today = await fetchHijriToday();
        if (alive) setHijri(today);
        const occasion = await fetchNextOccasion();
        if (alive) setNext(occasion);
      } catch {
        if (alive) setFailed(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // The row is supplementary — if the calendar service is down, show nothing
  // rather than an error the reader can't act on.
  if (failed) return null;

  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {hijri ? (
        <Tile>
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-control bg-brand/10 text-brand">
            <i className="ri-calendar-2-line text-2xl" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="t-label text-ink-3">التاريخ الهجري</p>
            <p className="t-title truncate text-ink">
              {hijri.day} {hijri.monthName} {hijri.year} هـ
            </p>
            <p className="t-meta truncate text-ink-3">
              {hijri.weekday} · {hijri.gregorian}
            </p>
          </div>
        </Tile>
      ) : (
        <Skeleton />
      )}

      {next ? (
        <Tile>
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-control bg-brand/10 text-brand">
            <i className={`${next.icon} text-2xl`} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="t-label text-ink-3">أقرب مناسبة</p>
            <p className="t-title truncate text-ink">{next.name}</p>
            <p className="t-meta truncate text-ink-3">
              {formatGregorian(next.date)}
            </p>
          </div>
          <div className="shrink-0">
            {next.days === 0 ? (
              <span className="rounded-control bg-brand px-3 py-2 text-sm font-bold text-white">
                اليوم
              </span>
            ) : (
              <div className="rounded-control bg-brand/10 px-3 py-2 text-center">
                <p className="text-xl font-bold tabular-nums leading-none text-brand">
                  {next.days}
                </p>
                <p className="t-label mt-0.5 text-brand/70">
                  {next.days === 1 ? "يوم" : "يوم"}
                </p>
              </div>
            )}
          </div>
        </Tile>
      ) : (
        <Skeleton />
      )}
    </div>
  );
};

export default InfoRow;
