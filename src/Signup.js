import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signup = async (username, password) => {
    setAuthLoading(true);
    setAuthError("");
    setSuccess(false);
    const response = await fetch(
      "https://todobackend-bi77.onrender.com/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );
    const data = await response.json();
    setAuthLoading(false);
    if (data.message === "User registered") {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setAuthError(data.message || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-2xl shadow-lg border border-orange-200">
      <h2 className="text-4xl font-bold text-center text-orange-600 mb-6">
        Create an Account
      </h2>

      {authError && (
        <div className="mb-4 text-center text-red-600 font-medium bg-red-100 border border-red-200 px-4 py-2 rounded-lg">
          {authError}
        </div>
      )}

      {success && (
        <div className="mb-4 text-center text-green-600 font-medium bg-green-100 border border-green-200 px-4 py-2 rounded-lg">
          ✅ Registration successful! Redirecting to login...
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          signup(username, password);
        }}
        className="space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-orange-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-orange-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={authLoading}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {authLoading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-gray-600">Already have an account? </span>
        <Link
          to="/login"
          className="text-orange-600 font-semibold hover:underline"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
