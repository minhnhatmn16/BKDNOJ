import { useState } from "react";
import { Link } from "react-router-dom";

export const SignInPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign in with:", username, password);
  };

  return (
    <div className="mx-auto max-w-md rounded-md bg-white p-8 shadow">
      <h2 className="mb-6 text-2xl font-bold">Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="mb-2 block text-sm font-medium">
            Username or Email
          </label>
          <input
            type="text"
            id="username"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <input type="checkbox" id="remember" className="mr-2" />
            <label htmlFor="remember" className="text-sm">
              Remember me
            </label>
          </div>
          <div>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Sign In
        </button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
