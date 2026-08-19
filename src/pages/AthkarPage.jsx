import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AthkarCard from "../components/AthkarCard/AthkarCard";

const apiUrl = import.meta.env.VITE_API_URL_ATHKAR;
const TABS = [
  { key: "morning", label: "أذكار الصباح", icon: "ri-sun-line" },
  { key: "evening", label: "أذكار المساء", icon: "ri-moon-line" },
];

const emptyProgress = () => ({
  morning: {},
  evening: {},
  lastMorningIdx: 0,
  lastEveningIdx: 0,
});

const RING = 2 * Math.PI * 26;

const today = () => new Date().toISOString().split("T")[0];

const AthkarPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [athkar, setAthkar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedAthkar = type === "evening" ? 1 : 0;
  const category = selectedAthkar === 0 ? "morning" : "evening";

  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem("athkarDailyProgress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === today()) return parsed.data || emptyProgress();
      } catch {
        /* corrupt entry — fall through to a fresh day */
      }
    }
    return emptyProgress();
  });

  useEffect(() => {
    localStorage.setItem(
      "athkarDailyProgress",
      JSON.stringify({ date: today(), data: progress })
    );
  }, [progress]);

  const getAthkar = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const cached = localStorage.getItem("athkar");
    if (cached) {
      try {
        setAthkar(JSON.parse(cached));
        setIsLoading(false);
        return;
      } catch {
        localStorage.removeItem("athkar");
      }
    }
    try {
      const res = await fetch(`${apiUrl}`);
      if (!res.ok) throw new Error("network");
      const data = await res.json();
      const athkarData = [data["أذكار الصباح"], data["أذكار المساء"]];
      setAthkar(athkarData);
      localStorage.setItem("athkar", JSON.stringify(athkarData));
    } catch {
      setError("تعذّر تحميل الأذكار. تحقق من اتصالك ثم أعد المحاولة.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getAthkar();
  }, [getAthkar]);

  useEffect(() => {
    if (!type) navigate("/athkar/morning", { replace: true });
  }, [type, navigate]);

  const lastIdx = selectedAthkar === 0 ? progress.lastMorningIdx : progress.lastEveningIdx;

  // Resume where the reader stopped: scroll the last-counted dhikr into view.
  useEffect(() => {
    if (isLoading || !athkar[selectedAthkar] || lastIdx <= 0) return;
    const t = setTimeout(() => {
      document
        .getElementById(`athkar-${selectedAthkar}-${lastIdx}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAthkar, isLoading]);

  const list = athkar[selectedAthkar];
  const totalCount = list?.length || 0;

  /*
    A dhikr counts as done when its stored remaining count is 0. Untouched
    items have no stored entry at all, so an explicit === 0 test on the
    stored value is what we want here.
  */
  const completedCount = useMemo(
    () => (list ? list.filter((_, idx) => progress[category][idx] === 0).length : 0),
    [list, category, progress]
  );

  const pct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleCountChange = useCallback(
    (tabIndex, index, currentCount) => {
      setProgress((prev) => {
        const cat = tabIndex === 0 ? "morning" : "evening";
        const next = { ...prev, [cat]: { ...prev[cat], [index]: currentCount } };
        const key = tabIndex === 0 ? "lastMorningIdx" : "lastEveningIdx";
        next[key] = Math.max(prev[key], index);
        return next;
      });
    },
    []
  );

  const resetCategory = () => {
    if (!confirm("هل تريد إعادة تعيين التقدم لهذا اليوم؟")) return;
    setProgress((prev) => ({
      ...prev,
      [category]: {},
      [selectedAthkar === 0 ? "lastMorningIdx" : "lastEveningIdx"]: 0,
    }));
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Tabs */}
      <div
        role="tablist"
        aria-label="نوع الأذكار"
        className="mx-auto mb-6 flex w-fit gap-1 rounded-control bg-surface/90 p-1"
      >
        {TABS.map((tab, i) => (
          <Link
            key={tab.key}
            to={`/athkar/${tab.key}`}
            role="tab"
            aria-selected={selectedAthkar === i}
            className={`flex items-center gap-2 rounded-[0.625rem] px-4 py-2 text-sm font-semibold transition-colors duration-200 sm:px-5 ${
              selectedAthkar === i
                ? "bg-brand text-white"
                : "text-ink-2 hover:bg-brand/10 hover:text-brand"
            }`}
          >
            <i className={`${tab.icon} text-base`} aria-hidden="true" />
            {tab.label}
          </Link>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3" aria-busy="true" aria-live="polite">
          <span className="sr-only">جاري تحميل الأذكار</span>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="surface-card flex gap-4 p-5">
              <div className="flex-1 space-y-2.5">
                <div className="h-4 w-full animate-pulse rounded bg-ink/10" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-ink/10" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-ink/10" />
              </div>
              <div className="h-16 w-16 shrink-0 animate-pulse rounded-control bg-ink/10" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="surface-card flex flex-col items-center gap-3 p-10 text-center">
          <i className="ri-wifi-off-line text-3xl text-ink-3" aria-hidden="true" />
          <p className="t-body text-ink-2">{error}</p>
          <button
            type="button"
            onClick={getAthkar}
            className="rounded-control bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Progress summary — a single quiet bar, not a dashboard. */}
          <div className="surface-card px-5 py-4">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h2 className="t-title text-ink">إنجازك اليوم</h2>
                <p className="t-meta text-ink-2">
                  لقد قرأت{" "}
                  <span className="font-bold tabular-nums text-brand">{completedCount}</span> من{" "}
                  <span className="tabular-nums">{totalCount}</span>
                </p>
              </div>
              {/* Completion ring — the at-a-glance read of the same number. */}
              <div className="relative grid h-16 w-16 shrink-0 place-items-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 64 64" aria-hidden="true">
                  <circle
                    cx="32" cy="32" r="26" fill="none" strokeWidth="5"
                    className="stroke-ink/10"
                  />
                  <circle
                    cx="32" cy="32" r="26" fill="none" strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={RING}
                    strokeDashoffset={RING - (RING * pct) / 100}
                    className="stroke-brand transition-[stroke-dashoffset] duration-700 ease-out"
                  />
                </svg>
                <span className="absolute text-sm font-bold tabular-nums text-brand">{pct}%</span>
              </div>
            </div>
            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="نسبة الإنجاز"
            >
              <div
                className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-end">
              <button
                type="button"
                onClick={resetCategory}
                className="t-label -m-2 flex items-center gap-1 p-2 text-ink-3 transition-colors hover:text-brand"
              >
                <i className="ri-refresh-line" aria-hidden="true" />
                إعادة تعيين
              </button>
            </div>
          </div>

          {list?.map((item, index) => {
            const saved = progress[category][index];
            const isLastReached = lastIdx === index && saved !== undefined && saved !== 0;

            return (
              <div
                key={`${index}-${item.category}`}
                id={`athkar-${selectedAthkar}-${index}`}
                className="relative"
              >
                {/* Where you stopped last time. */}
                {isLastReached && (
                  <span
                    aria-hidden="true"
                    className="absolute -start-3 top-1/2 hidden h-10 w-1 -translate-y-1/2 rounded-full bg-brand md:block"
                  />
                )}
                <AthkarCard
                  content={item.content}
                  count={+item.count}
                  initialCount={saved !== undefined ? saved : +item.count}
                  onCountChange={(newCount) =>
                    handleCountChange(selectedAthkar, index, newCount)
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AthkarPage;
