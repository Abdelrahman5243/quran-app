import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "القرآن الكريم", end: true },
  { to: "/athkar", label: "الأذكار", end: false },
];

const NavBar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    const mode =
      saved !== null
        ? saved === "true"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(mode);
    document.documentElement.classList.toggle("dark", mode);
  }, []);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("darkMode", next);
  };

  return (
    <header className="sticky top-0 z-50 surface-muted border-x-0 border-t-0">
      <nav
        aria-label="التنقل الرئيسي"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        {/* Segmented nav: two peer destinations, so both stay visible at every size. */}
        <div className="flex items-center gap-1 rounded-control bg-surface-2/70 p-1">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `rounded-[0.625rem] px-3 py-2 text-sm font-semibold transition-colors duration-200 sm:px-4 ${
                  isActive
                    ? "bg-brand text-white"
                    : "text-ink-2 hover:bg-brand/10 hover:text-brand"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          onClick={toggleDarkMode}
          className="control grid h-10 w-10 shrink-0 place-items-center text-ink-2 hover:text-brand"
          aria-label={isDarkMode ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن"}
          aria-pressed={isDarkMode}
        >
          <i
            className={`ri-${isDarkMode ? "sun" : "moon"}-line text-lg`}
            aria-hidden="true"
          />
        </button>
      </nav>
    </header>
  );
};

export default NavBar;
