import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddCategory() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: "",
    });

    // const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<Boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {

        const { name, value } = e.target as HTMLInputElement;
            setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // setLoading(true);
        setError(null);

    try {

        await axios.post("http://localhost:8080/categories", form, {
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
        }, 3000)

        
    } catch (err) {
        console.error("Error adding category:", err);
        alert("Failed to add category. Please try again.");
    } 
    
    };


 return (
    <>
      <Navbar />
      <div className="pt-24 flex">
        <Sidebar role="admin"/>

        <main className="flex-1 ml-64 px-6 py-12 max-w-3xl">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Category</h1>

          {error && <p className="text-red-600 text-center mb-3">{error}</p>}

          {success && (
            <p className="text-green-600 text-center mb-3">Category added successfully</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
            <div>
              <label htmlFor="name" className="block font-medium mb-1">Category Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block font-medium mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                className="border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
            >
                Submit
            </button>
            </form>
        </main>
        </div>
        <Footer />
    </>
  );


}