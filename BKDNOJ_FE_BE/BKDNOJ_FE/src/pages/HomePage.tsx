import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <div className="rounded-xl bg-white p-8 shadow-lg">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Text Section */}
        <div className="flex flex-col items-start justify-center space-y-6 md:col-span-7">
          <div>
            <p className="text-sm text-gray-500">Welcome to</p>
            <h1 className="text-3xl font-extrabold text-gray-800">
              Bách Khoa Đà Nẵng Online Judge 3.0
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              <div className="font-semibold"> Phase: openBETA</div>
            </span>
            <span className="text-sm text-gray-400">April 1, 2025</span>
          </div>

          <Link
            to="/contests"
            className="mt-4 inline-block rounded-xl bg-blue-600 px-6 py-2 text-white shadow transition hover:bg-blue-700"
          >
            Start Practicing
          </Link>
        </div>

        {/* Logo Section */}
        <div className="flex items-center justify-center md:col-span-5">
          <img
            src="/bkdnoj-dropflag.png"
            alt="BKDNOJ Logo"
            className="w-full max-w-xs drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
