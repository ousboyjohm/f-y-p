import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";


export default function SignIn() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<Boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("http://localhost:8080/login", form);


      const { jwt, userId, role } = res.data;

      sessionStorage.setItem("token", jwt);
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("role", role);

      setSuccess(true);

      setTimeout(() => {
        if (role === "SELLER") {
          navigate("/seller");
        } else if (role === "ADMIN"){
          navigate("/admin");
        } else {
          navigate("/customer")
        }
      }, 3000)

    } catch (err: any) {
      // console.error(err);
      // setError(err.response?.data?.message || "Invalid credentials. Please try again.");
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
      <><Navbar />
      <div className="bg-sky-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mt-10">
          <h2 className="text-center text-3xl font-bold mb-6">Log in</h2>

          {error && <p className="text-red-600 text-center mb-3">{error}</p>}

          {success && (
            <p className="text-green-600 text-center mb-3">Login Successfull</p>
          )}

          <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 text-gray-700 font-medium">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={form.username}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username" />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="mb-1 text-gray-700 font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password" />
            </div>

            <div className="text-center mt-3">
              <Link to="/register" className="text-blue-500">Create an account</Link>
            </div>

            <hr className="text-gray-300  mt-5"></hr>

            <button
              type="submit"
              disabled={loading}
              className="mt-7 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "LogIn"}
            </button>
          </form>
        </div>
      </div>
      </>
    );
}