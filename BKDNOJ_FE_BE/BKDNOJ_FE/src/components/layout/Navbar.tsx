import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="navbar border-b bg-white py-4">
        <div className="container flex flex-wrap items-center justify-between">
          {/* Left side: Brand + Navigation items */}
          <div className="flex items-center space-x-8">
            <Link
              id="brand"
              className="text-2xl font-semibold text-gray-800 hover:text-primary"
              to="/"
            >
              bkdnOJ
            </Link>

            {/* Desktop Navigation items */}
            <div className="hidden space-x-6 md:flex">
              {/* <button className="nav-link">Practice</button> */}
              <Link className="nav-link" to="/problems">
                Problem
              </Link>
              <Link className="nav-link" to="/submissions">
                Submission
              </Link>
              <Link className="nav-link" to="/submit">
                Submit
              </Link>
              <Link className="nav-link" to="/submitForm">
                SubmitForm
              </Link>
              <Link className="nav-link" to="/standing">
                Standing
              </Link>
              <Link className="nav-link" to="/contests">
                Contest
              </Link>
              {/* <Link className="nav-link" to="/orgs">
                Organization
              </Link> */}
            </div>
          </div>

          {/* Right side: Auth buttons & Mobile menu toggle */}
          <div className="flex items-center space-x-6">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-md p-2 focus:outline-none md:hidden"
              aria-label="Toggle navigation"
            >
              <Menu size={20} />
            </button>

            {/* Desktop auth buttons */}
            <div className="hidden space-x-4 md:flex">
              <Link
                className="nav-link text-sm font-medium text-gray-800 hover:text-primary"
                to="/sign-up"
              >
                Sign Up
              </Link>
              <Link
                className="nav-link text-sm font-medium text-gray-800 hover:text-primary"
                to="/sign-in"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu content */}
        {isMenuOpen && (
          <div className="mt-4 w-full md:hidden">
            <div className="flex flex-col space-y-4">
              <button className="nav-link">Practice</button>
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
