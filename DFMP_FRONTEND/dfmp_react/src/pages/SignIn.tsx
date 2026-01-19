import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// This is the page that is responsible for signing in a user into their account. When the user enters their
// credentials and clicks the sign in button, the handleSubmit function sends the login
// request to the backend. On success, the user is taken to their dashboard based on their role.

export default function SignIn() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<Boolean>(false);

  const [showPassword, setShowPassword] = useState(false); // For eye-icon

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const API_URL = import.meta.env.VITE_API_URL;
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${API_URL}/login`, form);
      const { jwt, userId, role } = res.data;
      sessionStorage.setItem("token", jwt);
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("role", role);

      setSuccess(true);

      setTimeout(() => {
        if (role === "SELLER") {
          navigate("/seller");
        } else if (role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/customer");
        }
      }, 1500);
    } catch (err: any) {
      setError("Invalid credentials");
      setTimeout(() => {
        setError(null);
        setForm({ ...form, password: "" });
      }, 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-blue-100 via-blue-200 to-sky-100 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md mt-12 relative animate-fade-in">
          <div className="flex flex-col items-center gap-1 mb-8">
            <img
              src="https://cdn-icons-png.flaticon.com/512/295/295128.png"
              alt="login avatar"
              className="w-16 h-16 rounded-full border-2 border-blue-400 shadow"
            />
            <h2 className="text-center text-3xl font-semibold text-blue-700 font-display mt-2">Sign In</h2>
            <p className="text-sky-600 text-sm">
              Access your account
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 rounded text-red-700 px-3 py-2 mb-4 text-center animate-shake">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-300 rounded text-green-700 px-3 py-2 mb-4 text-center animate-fade-in-fast">
              Login Successful
            </div>
          )}

          <form className="flex flex-col gap-y-5" onSubmit={handleSubmit} aria-label="Signin form">
            <div>
              <label
                htmlFor="username"
                className="block mb-1 text-gray-700 font-semibold tracking-wide"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                autoComplete="username"
                value={form.username}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Enter your username"
                aria-label="Username"
              />
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block mb-1 text-gray-700 font-semibold tracking-wide"
              >
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-10"
                placeholder="Enter your password"
                aria-label="Password"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((show) => !show)}
                className="absolute right-3 top-9 text-gray-400 w-6 h-6 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // open eye
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  // closed eye
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.065 10.065 0 013.227-4.568M6.84 6.839A9.978 9.978 0 0112 5c4.477 0 8.267 2.943 9.541 7a9.98 9.98 0 01-4.304 5.173M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex justify-between items-center text-sm mt-2">
              <span className="text-gray-500">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                  Sign up
                </Link>
              </span>
              <Link to="/login" className="text-blue-500 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-5 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2 rounded-xl shadow hover:bg-blue-700 transition-colors duration-200 focus:ring-2 focus:ring-blue-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed`}
              aria-busy={loading}
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
      <style>
        {`
          .animate-fade-in { animation: fadeIn 0.8s; }
          .animate-fade-in-fast { animation: fadeIn 0.4s; }
          .animate-shake { animation: shake 0.3s; }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(25px);}
            to { opacity: 1; transform: none;}
          }
          @keyframes shake {
            10%, 90% { transform: translateX(-2px);}
            20%, 80% { transform: translateX(3px);}
            30%, 50%, 70% { transform: translateX(-4px);}
            40%, 60% { transform: translateX(4px);}
          }
        `}
      </style>
    </>
  );
}