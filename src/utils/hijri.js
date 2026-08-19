/**
 * Hijri date + upcoming occasion, from the AlAdhan API.
 * Docs: https://aladhan.com/islamic-calendar-api
 *
 * The API is the source of truth for both the Hijri conversion (Umm al-Qura)
 * and the holiday dates, so nothing here re-implements calendar arithmetic.
 * Responses are cached in localStorage for the day.
 */

const API = "https://api.aladhan.com/v1";

const pad = (n) => String(n).padStart(2, "0");
const ddmmyyyy = (d) =>
  `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;

const cache = {
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const { date, value } = JSON.parse(raw);
      return date === new Date().toDateString() ? value : null;
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(
        key,
        JSON.stringify({ date: new Date().toDateString(), value })
      );
    } catch {
      /* storage full or unavailable — caching is optional */
    }
  },
};

/** Today's Hijri date. */
export async function fetchHijriToday() {
  const cached = cache.get("hijriToday");
  if (cached) return cached;

  const res = await fetch(`${API}/gToH/${ddmmyyyy(new Date())}`);
  if (!res.ok) throw new Error("hijri fetch failed");
  const { data } = await res.json();

  const value = {
    day: data.hijri.day,
    monthName: data.hijri.month.ar,
    year: data.hijri.year,
    weekday: data.hijri.weekday.ar,
    gregorian: formatGregorian(new Date()),
  };
  cache.set("hijriToday", value);
  return value;
}

const parseGregorian = (s) => {
  const [d, m, y] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/**
 * Major observances at their fixed Hijri dates. The API resolves each to a
 * real Gregorian date (hToG), so no calendar arithmetic happens here — the
 * year-level holidays endpoint only lists minor observances, which is why
 * these are addressed by date rather than pulled from it.
 */
const OCCASIONS = [
  { month: 1, day: 1, name: "رأس السنة الهجرية", icon: "ri-calendar-2-line" },
  { month: 1, day: 10, name: "يوم عاشوراء", icon: "ri-drop-line" },
  { month: 3, day: 12, name: "المولد النبوي", icon: "ri-star-line" },
  { month: 7, day: 27, name: "الإسراء والمعراج", icon: "ri-moon-clear-line" },
  { month: 8, day: 15, name: "ليلة النصف من شعبان", icon: "ri-moon-line" },
  { month: 9, day: 1, name: "أول رمضان", icon: "ri-moon-clear-fill" },
  { month: 9, day: 27, name: "ليلة القدر", icon: "ri-sparkling-2-line" },
  { month: 10, day: 1, name: "عيد الفطر", icon: "ri-gift-line" },
  { month: 12, day: 9, name: "يوم عرفة", icon: "ri-mountain-line" },
  { month: 12, day: 10, name: "عيد الأضحى", icon: "ri-gift-2-line" },
];

/** The soonest upcoming major occasion. */
export async function fetchNextOccasion() {
  const cached = cache.get("nextOccasion");
  if (cached) return { ...cached, date: new Date(cached.date) };

  const hijriYear = Number((await fetchHijriToday()).year);
  const today = new Date();
  const midnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  // Current Hijri year and the next, so late-year dates roll over.
  const lookups = [hijriYear, hijriYear + 1].flatMap((year) =>
    OCCASIONS.map(async (occ) => {
      const res = await fetch(
        `${API}/hToG/${pad(occ.day)}-${pad(occ.month)}-${year}`
      ).catch(() => null);
      if (!res?.ok) return null;
      const { data } = await res.json();
      const date = parseGregorian(data.gregorian.date);
      const days = Math.round((date - midnight) / 86400000);
      return days >= 0 ? { ...occ, date, days } : null;
    })
  );

  const candidates = (await Promise.all(lookups)).filter(Boolean);
  candidates.sort((a, b) => a.days - b.days);

  const next = candidates[0] ?? null;
  if (next) cache.set("nextOccasion", { ...next, date: next.date.toISOString() });
  return next;
}

/** Arabic month names with Latin numerals, to match the rest of the UI. */
export function formatGregorian(date) {
  return new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
