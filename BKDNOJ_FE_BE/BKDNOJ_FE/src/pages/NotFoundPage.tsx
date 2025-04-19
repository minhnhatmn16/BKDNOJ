import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="shadow text-dark flex flex-col justify-center text-center bg-white rounded-md p-8" style={{ minHeight: "200px", minWidth: "400px" }}>
      <h4 className="text-2xl font-bold">404 | Page Not Found</h4>
      <p className="mt-4">
        The page you're looking for doesn't exist or another error occurred.
      </p>
      <Link to="/" className="mt-6 text-blue-600 hover:underline">
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
