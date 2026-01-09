import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



export default function SignUp() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    username: "",
    password: "",
    role: "SELLER"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<Boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
       await axios.post("http://localhost:8080/signup", form);

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000) 
    } catch (err: any) {
      // console.error(err.response?.data || err.message);
      // setError(err.response?.data?.message || "Something went wrong.");
      setError(err.response?.data || "Something went wrong.");
      setTimeout(() => {
        setError(null);
      }, 4000);
    } finally {
      setLoading(false);
    }
  };

    return (
    <div className="bg-sky-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-center text-3xl font-bold mb-6">Create an account</h2>

        {error && (
          <p className="text-red-600 text-center mb-3">{error}</p>
        )}

        {success && (
          <p className="text-green-600 text-center mb-3">Account Created Successfully</p>
        )}

        <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>

          <div className="flex gap-x-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1 text-gray-700 font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="address" className="mb-1 text-gray-700 font-medium">
              Address
            </label>
            <input
              id="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your address"
            />
          </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="phoneNumber" className="mb-1 text-gray-700 font-medium">
              Phone
            </label>
            <input
              id="phoneNumber"
              type="text"
              value={form.phoneNumber}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="flex gap-x-4">
          <div className="flex flex-col">
            <label htmlFor="username" className="mb-1 text-gray-700 font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your  username"
            />
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
              placeholder="Enter your password"
            />
          </div>
          </div>

          <div className="text-center mt-3">
            <Link to="/login" className="text-blue-500">I already have an account</Link>
          </div>

          <hr className="text-gray-300  mt-5"></hr>

          <button
              type="submit"
              disabled={loading}
              className="mt-7 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
        </form>
      </div>
    </div>
  );
}