const Footer = () => {
  return (
    <footer className="surface-muted mt-16 border-x-0 border-b-0 py-5 text-center">
      <p className="t-meta text-ink-3">
        بواسطة{" "}
        <a
          href="https://alquran.cloud"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand underline decoration-brand/30 underline-offset-4 transition-colors hover:decoration-brand"
        >
          Al-Quran Cloud API
        </a>
      </p>
    </footer>
  );
};

export default Footer;
