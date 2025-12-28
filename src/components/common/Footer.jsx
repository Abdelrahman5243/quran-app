const Footer = () => {
  return (
    <footer className="w-full backdrop-blur-md bg-white/40 dark:bg-black/40 border-t border-white/20 dark:border-white/10 text-center py-6">
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
        Using{" "}
        <a
          href="https://alquran.cloud"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-500 transition-colors"
        >
          Al-Quran Cloud API
        </a>
      </p>
    </footer>
  );
};

export default Footer;
