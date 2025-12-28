import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    const mode = savedMode === "true";
    setIsDarkMode(mode);
    document.documentElement.classList.toggle("dark", mode);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("darkMode", newMode);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/50 border-b border-white/20 dark:border-white/10 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="glass-button w-10 h-10 flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-200"
              onClick={toggleMobileMenu}
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">افتح القائمة الرئيسية</span>
              {isMobileMenuOpen ? (
                <i className="ri-close-line text-2xl" aria-hidden="true"></i>
              ) : (
                <i className="ri-menu-line text-2xl" aria-hidden="true"></i>
              )}
            </button>
          </div>
          
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:block">
              <div className="flex gap-2">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `rounded-xl px-4 md:px-6 py-2.5 text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                        : "text-slate-600 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
                    }`
                  }
                >
                  القرآن الكريم
                </NavLink>
                <NavLink
                  to="/athkar"
                  className={({ isActive }) =>
                    `rounded-xl px-4 md:px-6 py-2.5 text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                        : "text-slate-600 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
                    }`
                  }
                >
                  الأذكار
                </NavLink>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="glass-button w-10 h-10 flex items-center justify-center rounded-full text-slate-700 dark:text-slate-200 group"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن"}
            >
              <i
                className={`ri-${isDarkMode ? "sun" : "moon"}-line text-xl group-hover:rotate-12 transition-transform`}
                aria-hidden="true"
              ></i>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${isMobileMenuOpen ? "block" : "hidden"} sm:hidden border-t border-white/10 animate-fade-in transition-all duration-300`}
        id="mobile-menu"
      >
        <div className="space-y-2 px-4 pb-6 pt-4">
          <NavLink
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 text-base font-bold transition-all duration-300 ${
                isActive
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "text-slate-600 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
              }`
            }
          >
            القرآن الكريم
          </NavLink>
          <NavLink
            to="/athkar"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 text-base font-bold transition-all duration-300 ${
                isActive
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "text-slate-600 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
              }`
            }
          >
            الأذكار
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
