import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navLinkClass = (path: string) =>
    `nav-link pb-1 transition-all duration-150 ${
      isActive(path)
        ? "border-b-2 border-blue-700 text-black"
        : "border-b-2 border-transparent text-gray-600 hover:border-gray-400"
    }`;

  return (
    <div className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="navbar border-b bg-white py-4">
        <div className="container flex flex-wrap items-center justify-between">
          {/* Left side */}
          <div className="flex items-center space-x-8">
            <div id="brand" className="text-2xl font-semibold text-gray-800 hover:text-primary">
              bkdnOJ
            </div>

            {/* Desktop nav items */}
            <div className="hidden space-x-6 md:flex">
              <Link className={navLinkClass("/problems")} to="/problems">
                PROBLEMSET
              </Link>
              <Link className={navLinkClass("/detailproblem")} to="/detailproblem">
                Detail Problem
              </Link>
              <Link className={navLinkClass("/contests")} to="/contests">
                CONTESTS
              </Link>
              <Link className={navLinkClass("/submissions")} to="/submissions">
                SUBMISSIONS
              </Link>
              <Link className={navLinkClass("/profile")} to="/profile">
                Profile
              </Link>
              <Link className={navLinkClass("/createcontest")} to="/createcontest">
                Create Contest
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-md p-2 focus:outline-none md:hidden"
              aria-label="Toggle navigation"
            >
              <Menu size={20} />
            </button>

            {/* Desktop auth */}
            <div className="hidden space-x-4 md:flex">
              <Link
                className="nav-link text-sm font-medium text-gray-800 hover:text-primary"
                to="/register"
              >
                Register
              </Link>
              <Link
                className="nav-link text-sm font-medium text-gray-800 hover:text-primary"
                to="/login"
              >
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="mt-4 w-full md:hidden">
            <div className="flex flex-col space-y-4">
              <Link className="nav-link" to="/contests">
                Contest
              </Link>
              <Link className="nav-link" to="/orgs">
                Organization
              </Link>
              <Link className="nav-link" to="/sign-up">
                Sign Up
              </Link>
              <Link className="nav-link" to="/sign-in">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
