import React from "react";

const Footer = () => {
  return (
    <footer className="w-full text-gray-600 dark:text-gray-100 bg-white dark:bg-slate-800 text-center py-4 shadow-md">
      <p className="text-sm">
        Using{" "}
        <a
          href="https://alquran.cloud"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 font-bold hover:underline"
        >
          Al-Quran Cloud API
        </a>
      </p>
    </footer>
  );
};

export default Footer;
