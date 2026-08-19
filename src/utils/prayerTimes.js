/**
 * Prayer times from the AlAdhan API (same service as the Hijri calendar).
 * Docs: https://aladhan.com/prayer-times-api
 *
 * Times come back as local "HH:mm" strings for the requested coordinates,
 * along with the IANA timezone, so all comparisons here are done in that
 * timezone rather than the device's.
 */

const API = "https://api.aladhan.com/v1";

/** Used when the browser denies or cannot provide a location. */
export const DEFAULT_LOCATION = {
  latitude: 30.0444,
  longitude: 31.2357,
  label: "القاهرة",
};

/** The five obligatory prayers, plus sunrise as a marker on the day. */
export const PRAYERS = [
  { key: "Fajr", name: "الفجر", icon: "ri-moon-clear-line" },
  { key: "Sunrise", name: "الشروق", icon: "ri-sun-foggy-line", marker: true },
  { key: "Dhuhr", name: "الظهر", icon: "ri-sun-line" },
  { key: "Asr", name: "العصر", icon: "ri-sun-cloudy-line" },
  { key: "Maghrib", name: "المغرب", icon: "ri-sun-set-line" },
  { key: "Isha", name: "العشاء", icon: "ri-moon-line" },
];

const CACHE_KEY = "prayerTimes";

/** Arabic names for the cities the timezone label is most likely to yield. */
const CITY_AR = {
  Cairo: "القاهرة",
  Riyadh: "الرياض",
  Mecca: "مكة المكرمة",
  Medina: "المدينة المنورة",
  Jeddah: "جدة",
  Dubai: "دبي",
  Abu_Dhabi: "أبوظبي",
  Kuwait: "الكويت",
  Qatar: "الدوحة",
  Baghdad: "بغداد",
  Damascus: "دمشق",
  Amman: "عمّان",
  Beirut: "بيروت",
  Gaza: "غزة",
  Hebron: "الخليل",
  Jerusalem: "القدس",
  Khartoum: "الخرطوم",
  Tripoli: "طرابلس",
  Tunis: "تونس",
  Algiers: "الجزائر",
  Casablanca: "الدار البيضاء",
  Istanbul: "إسطنبول",
  Karachi: "كراتشي",
  Jakarta: "جاكرتا",
  London: "لندن",
  Paris: "باريس",
  Berlin: "برلين",
};

/** A previously resolved location, if one was stored. */
export function getSavedLocation() {
  try {
    const saved = localStorage.getItem("prayerLocation");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

/**
 * Browser geolocation. Resolves to null (never rejects) when unavailable or
 * denied, so the caller can keep showing the default location's times rather
 * than blocking the UI on a permission prompt that may never be answered.
 */
export function requestLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const location = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };
        try {
          localStorage.setItem("prayerLocation", JSON.stringify(location));
        } catch {
          /* storage unavailable */
        }
        resolve(location);
      },
      () => resolve(null),
      { timeout: 8000, maximumAge: 3600_000 }
    );
  });
}

/** "HH:mm" on a given day, as minutes since midnight. */
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Current wall-clock minutes in an IANA timezone. */
function nowMinutesIn(timeZone) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t) => Number(parts.find((p) => p.type === t)?.value);
  return get("hour") * 60 + get("minute") + get("second") / 60;
}

/** 24h "HH:mm" → Arabic 12-hour label, e.g. "٧:٣٢ م" in Latin digits. */
export function formatTime(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h < 12 ? "ص" : "م";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** "2:47:15" style countdown from a fractional-minute gap. */
export function formatCountdown(minutes) {
  const total = Math.max(0, Math.round(minutes * 60));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export async function fetchPrayerTimes(location) {
  const { latitude, longitude } = location;
  const today = new Date().toDateString();

  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const cached = JSON.parse(raw);
      // Re-fetch if the day rolled over or the user moved appreciably.
      if (
        cached.date === today &&
        Math.abs(cached.latitude - latitude) < 0.1 &&
        Math.abs(cached.longitude - longitude) < 0.1
      ) {
        return cached.value;
      }
    }
  } catch {
    /* ignore a corrupt cache entry */
  }

  const res = await fetch(
    `${API}/timings?latitude=${latitude}&longitude=${longitude}&method=5`
  );
  if (!res.ok) throw new Error("prayer times fetch failed");
  const { data } = await res.json();

  const value = {
    timings: data.timings,
    timezone: data.meta.timezone,
    // The API doesn't return a city label here, so derive it from the tz.
    place: (() => {
      const city = data.meta.timezone.split("/").pop();
      return CITY_AR[city] ?? city.replace(/_/g, " ");
    })(),
  };

  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ date: today, latitude, longitude, value })
    );
  } catch {
    /* storage unavailable — caching is optional */
  }
  return value;
}

/**
 * Which prayer is next, how long until it, and how far the day has progressed.
 * After Isha the next prayer is tomorrow's Fajr, so the gap wraps past midnight.
 */
export function getPrayerState({ timings, timezone }) {
  const now = nowMinutesIn(timezone);

  const schedule = PRAYERS.map((p) => ({
    ...p,
    time: timings[p.key],
    minutes: toMinutes(timings[p.key]),
  }));

  const obligatory = schedule.filter((p) => !p.marker);
  let next = obligatory.find((p) => p.minutes > now);
  let untilNext;

  if (next) {
    untilNext = next.minutes - now;
  } else {
    // Past Isha — wrap to tomorrow's Fajr.
    next = obligatory[0];
    untilNext = 1440 - now + next.minutes;
  }

  // The prayer whose window we are inside. Before Fajr and after Isha this
  // is Isha (yesterday's), which is why the index wraps rather than clamping.
  const nextIndex = obligatory.findIndex((p) => p.key === next.key);
  const current =
    nextIndex === 0 ? obligatory[obligatory.length - 1] : obligatory[nextIndex - 1];
  const wrapped = nextIndex === 0;

  return {
    schedule,
    next,
    current,
    untilNext,
    // Elapsed share of the window between the current and the next prayer.
    windowProgress: (() => {
      const span = wrapped
        ? 1440 - current.minutes + next.minutes
        : next.minutes - current.minutes;
      const elapsed = wrapped
        ? (now >= current.minutes ? now - current.minutes : 1440 - current.minutes + now)
        : now - current.minutes;
      return span > 0 ? Math.min(1, Math.max(0, elapsed / span)) : 0;
    })(),
  };
}
