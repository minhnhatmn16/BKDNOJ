// src/pages/LoginPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getCurrentUser } from "../../api";
import { useAuth } from "./contexts/authContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token } = res.data.data;
      localStorage.setItem("token", token);

      const userRes = await getCurrentUser();
      console.log(userRes.data.data);
      setUser(userRes.data.data);

      navigate("/problems");
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-md bg-white p-8 shadow">
      <h2 className="mb-6 text-2xl font-bold">Login</h2>
      {error && (
        <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-sm text-red-700">{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input
            type="text"
            id="username"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
        >
          Login
        </button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
