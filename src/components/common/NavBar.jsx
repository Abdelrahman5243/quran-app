import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    setIsDarkMode(savedMode === "true");
    document.documentElement.classList.toggle("dark", savedMode === "true");
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
    <nav className="bg-light-1 dark:bg-dark-1">
      <div className="mx-auto container py-3 px-6">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2
               text-dark-1 dark:text-light-1 hover:bg-light-2 dark:hover:bg-dark-2 hover:text-dark-1 dark:hover:text-light-1 outline-none"
              onClick={toggleMobileMenu}
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">افتح القائمة الرئيسية</span>
              {isMobileMenuOpen ? (
                <i className={`ri-close-line h-6 w-6`} aria-hidden="true"></i>
              ) : (
                <i className={`ri-menu-line h-6 w-6`} aria-hidden="true"></i>
              )}
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex gap-4">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `rounded-md p-3 px-4 text-sm font-medium ${
                      isActive
                        ? "bg-light-2 dark:bg-dark-2 text-dark-1 dark:text-light-1"
                        : "text-dark-1 dark:text-light-1 hover:bg-light-2 dark:hover:bg-dark-2 hover:text-dark-1 dark:hover:text-light-1"
                    }`
                  }
                >
                  القرآن الكريم
                </NavLink>
                <NavLink
                  to="/athkar"
                  className={({ isActive }) =>
                    `rounded-md p-3 px-4 text-sm font-medium ${
                      isActive
                        ? "bg-light-2 dark:bg-dark-2 text-dark-1 dark:text-light-1"
                        : "text-dark-1 dark:text-light-1 hover:bg-light-2 dark:hover:bg-dark-2 hover:text-dark-1 dark:hover:text-light-1"
                    }`
                  }
                >
                  الأذكار
                </NavLink>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="relative p-1 text-dark-1 dark:text-light-1 outline-none"
              onClick={toggleDarkMode}
              aria-label={`التبديل إلى الوضع ${
                isDarkMode ? "الفاتح" : "الداكن"
              }`}
            >
              <span className="absolute -inset-1.5"></span>
              <span className="sr-only">تغيير الوضع</span>
              <i
                className={`ri-${isDarkMode ? "sun" : "moon"}-line h-6 w-6`}
                aria-hidden="true"
              ></i>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${isMobileMenuOpen ? "block" : "hidden"} sm:hidden`}
        id="mobile-menu"
      >
        <div className="space-y-1 px-2 pb-3 pt-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-base font-medium ${
                isActive
                  ? "bg-light-2 dark:bg-dark-2 text-dark-1 dark:text-light-1"
                  : "text-dark-1 dark:text-light-1 hover:bg-light-2 dark:hover:bg-dark-2 hover:text-dark-1 dark:hover:text-light-1"
              }`
            }
          >
            القرآن الكريم
          </NavLink>
          <NavLink
            to="/athkar"
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-base font-medium ${
                isActive
                  ? "bg-light-2 dark:bg-dark-2 text-dark-1 dark:text-light-1"
                  : "text-dark-1 dark:text-light-1 hover:bg-light-2 dark:hover:bg-dark-2 hover:text-dark-1 dark:hover:text-light-1"
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
