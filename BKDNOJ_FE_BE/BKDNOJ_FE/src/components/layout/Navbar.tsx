import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "../../pages/auth/contexts/authContext";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);
  const navLinkClass = (path: string) =>
    `nav-link pb-1 transition-all duration-150 ${
      isActive(path)
        ? "border-b-2 border-blue-700 text-black"
        : "border-b-2 border-transparent text-gray-600 hover:border-gray-400"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

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
                Problemset
              </Link>
              {/* <Link className={navLinkClass("/detailproblem")} to="/detailproblem">
                Detail Problem
              </Link> */}
              <Link className={navLinkClass("/contests")} to="/contests">
                Contests
              </Link>
              <Link className={navLinkClass("/submissions")} to="/submissions">
                Submissions
              </Link>
              {/* <Link className={navLinkClass("/profile")} to="/profile">
                Profile
              </Link> */}
              {user?.role === "admin" && (
                <div className="group relative">
                  <button className="nav-link border-b-2 border-transparent pb-1 text-gray-600 hover:text-black group-hover:border-gray-400">
                    Manage
                  </button>
                  <div className="invisible absolute left-0 z-50 mt-2 w-48 -translate-y-2 transform rounded-md bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <Link
                      to="/admin/problems"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Manage Problems
                    </Link>
                    <Link
                      to="/admin/contests"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Manage Contests
                    </Link>
                  </div>
                </div>
              )}
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
            {/* <div className="hidden space-x-4 md:flex">
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
            </div> */}
            <div className="hidden items-center space-x-4 md:flex">
              {user ? (
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt="avatar"
                    className="h-8 w-8 rounded-full"
                  />
                  <Link
                    to={`/profile/${user.user_name}`}
                    className="text-sm font-medium text-gray-800 hover:text-primary"
                  >
                    {user.user_name}
                  </Link>
                  <span className="text-gray-400">|</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-800 hover:text-primary"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu
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
        )} */}
      </nav>
    </div>
  );
};

export default Navbar;
