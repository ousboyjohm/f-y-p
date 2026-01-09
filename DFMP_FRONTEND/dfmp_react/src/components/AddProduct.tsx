import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddProduct() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    pricePerUnit: "",
    stockQuantity: "",
    category: {id: 1},
    seller: {id: 2},
    imageUrl: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<Boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files) {
      setForm({ ...form, imageUrl: files[0].name });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
   setError(null);

  try {
    // Create FormData for file upload
    // const formData = new FormData();
    // formData.append("name", form.name);
    // formData.append("description", form.description);
    // formData.append("price", form.pricePerUnit);
    // formData.append("quantity", form.stockQuantity);
    //formData.append("category", form.category.id);
    
    // if (form.imageUrl) {
    //   formData.append("image", form.imageUrl);
    // }

    // Send POST request
    await axios.post("http://localhost:8080/products", form, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // console.log("Product added:", response.data);
    // alert("Product added successfully!");
    setSuccess(true);

        setTimeout(() => {
            setForm({
              name: "",
              description: "",
              pricePerUnit: "",
              stockQuantity: "",
              category: {id: 1},
              imageUrl: "",
              seller: {id: 2}
            });
            navigate("/seller");
        }, 3000)

    
  } catch (err) {
    console.error("Error adding product:", err);
    alert("Failed to add product. Please try again.");
  }
};

  return (
    <>
      <Navbar />
      <div className="pt-10 flex">

        <Sidebar role="seller"/>

        <main className="flex-1 ml-64 px-6 py-12 max-w-3xl">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Product</h1>

          {error && <p className="text-red-600 text-center mb-3">{error}</p>}

          {success && (
            <p className="text-green-600 text-center mb-3">Category added successfully</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
            <div>
              <label htmlFor="name" className="block font-medium mb-1">Product Name</label>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="pricePerUnit" className="block font-medium mb-1">Price (D)</label>
                <input
                  id="pricePerUnit"
                  type="number"
                  name="pricePerUnit"
                  value={form.pricePerUnit}
                  onChange={handleChange}
                  className="border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="stockQuantity" className="block font-medium mb-1">Quantity</label>
                <input
                  id="stockQuantity"
                  type="number"
                  name="stockQuantity"
                  value={form.stockQuantity}
                  onChange={handleChange}
                  className="border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block font-medium mb-1">Category</label>
              <select
                id="category"
                name="category"
                // value={form.category.id}
                // onChange={handleChange}
                className="border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Fish</option>
                <option>Prawns</option>
                <option>Crabs</option>
                <option>Lobsters</option>
              </select>
            </div>

            <div>
              <label htmlFor="image" className="block font-medium mb-1">Image Upload</label>
              <input
                id="image"
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
                className="w-full"
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