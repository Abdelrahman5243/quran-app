import { Outlet } from "react-router-dom";
import Footer from "./components/common/Footer";
import NavBar from "./components/common/NavBar";

const Layout = () => {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[60] focus:rounded-control focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        تخطَّ إلى المحتوى
      </a>
      <NavBar />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
