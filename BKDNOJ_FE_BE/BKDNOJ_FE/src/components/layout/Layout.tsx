import { ReactNode } from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import Subheader from "./Subheader";
import Footer from "./Footer";
import { ArrowUp } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div id="root">
      {/* <Header /> */}
      <Navbar />
      {/* <Subheader /> */}
      <div className="content-wrapper mt-8">
        <div className="content container py-4">{children}</div>
      </div>
      {/* <Footer /> */}
      {/* <button
        type="button"
        className="btn-svg scroll-top-btn fixed bottom-4 right-4 z-50 rounded-full bg-white p-2 shadow-md"
        onClick={scrollToTop}
      >
        <ArrowUp size={20} />
      </button> */}
    </div>
  );
};

export default Layout;
