import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// This is the component responsible for editing and adding a new category to the system. If it is to add, 
// it has a form where the details of the category is entered. When the button to add is clicked, the 
// handleSubmit function is called. The function checks whether there is no id availlable. If no id is 
// available, the function sends a post request to the backend.
// When it is to do an edition, it takes the id of the category from the params and stores it in the id
// variable, and it also takes the category to be edited from the page that triggers the edition and 
// stores it in the category variable. It then prefill the form with the category's values
// When the button to edit is clicked, the handleSubmit function is called which checks whether there is id
// available in the  id variable. If there is, the function sends a put request to the backend for update.

export default function AddCategory() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<Boolean>(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setLoading(true);
    setError(null);

    try {
      await axios.post(`${API_URL}/categories`, form, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setSuccess(true);

      setTimeout(() => {
        setForm({
          name: "",
          description: "",
        });
        navigate("/admin");
      }, 3000);
    } catch (err) {
      console.error("Error adding category:", err);
      alert("Failed to add category. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex">
        <Sidebar role="admin" />

        <main className="flex-1 ml-64 flex items-center justify-center">
          <div className="w-full max-w-2xl bg-white/80 rounded-2xl shadow-2xl p-10 border border-blue-100">
            <h1 className="text-4xl font-extrabold text-center mb-4 text-blue-700 drop-shadow">Add New Category</h1>
            <p className="text-center text-gray-500 mb-9">
              Enter details to create a new category. These will help organize your products!
            </p>

            {error && (
              <p className="text-red-600 text-center mb-4 font-medium bg-red-50 border border-red-200 px-2 py-1 rounded">
                {error}
              </p>
            )}

            {success && (
              <div className="flex justify-center mb-4">
                <span className="inline-block px-4 py-2 font-semibold bg-green-100 text-green-700 rounded border border-green-200 shadow">
                  Category added successfully!
                </span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-7"
              autoComplete="off"
              spellCheck="false"
            >
              <div>
                <label htmlFor="name" className="block font-bold mb-1 text-blue-900">
                  Category Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="border-2 border-blue-200 rounded-lg w-full px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:bg-blue-50 transition-all duration-150"
                  required
                  placeholder="Enter category name…"
                />
              </div>

              <div>
                <label htmlFor="description" className="block font-bold mb-1 text-blue-900">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="border-2 border-blue-200 rounded-lg w-full px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:bg-blue-50 resize-none transition-all duration-150"
                  required
                  placeholder="Describe the category"
                  rows={3}
                />
              </div>

              <div className="flex justify-end mt-8">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg px-7 py-3 transition-all duration-150 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}