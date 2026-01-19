import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import type { Product } from "../models/modelTypes";

/**
 * AddProduct - Handles creating and editing a product, using JSON payload
 * UI is visually improved for clarity and UX
 */

const CATEGORY_OPTIONS = [
  { id: 1, label: "Fish" },
  { id: 2, label: "Prawns" },
  { id: 3, label: "Crabs" },
  { id: 4, label: "Lobsters" },
];

export default function AddProduct() {
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const { state } = useLocation();
  const product: Product | undefined = state?.product;

  const [form, setForm] = useState({
    name: "",
    description: "",
    pricePerUnit: "",
    stockQuantity: "",
    category: { id: CATEGORY_OPTIONS[0].id },
    seller: { id: Number(sessionStorage.getItem("userId") ?? 0) },
    imageUrl: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Pre-fill the form in edit mode
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        pricePerUnit: String(product.pricePerUnit),
        stockQuantity: String(product.stockQuantity),
        category: { id: product.category.id },
        seller: { id: product.seller.id },
        imageUrl: product.imageUrl || "",
      });
    }
  }, [product]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, files } = e.target as HTMLInputElement;

    if (type === "file" && files && files[0]) {
      setForm((prev) => ({
        ...prev,
        imageUrl: files[0].name,
      }));
    } else if (name === "category") {
      setForm((prev) => ({
        ...prev,
        category: { id: Number(value) },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      ...form,
      pricePerUnit: Number(form.pricePerUnit),
      stockQuantity: Number(form.stockQuantity),
      category: { id: form.category.id },
      seller: { id: form.seller.id },
      imageUrl: form.imageUrl,
    };

    try {
      if (productId) {
        await axios.put(`${API_URL}/products/${productId}`, { ...payload, id: productId }, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        await axios.post(`${API_URL}/products`, payload, {
          headers: { "Content-Type": "application/json" },
        });
      }
      setSuccess(true);

      setTimeout(() => {
        setForm({
          name: "",
          description: "",
          pricePerUnit: "",
          stockQuantity: "",
          category: { id: CATEGORY_OPTIONS[0].id },
          seller: { id: Number(sessionStorage.getItem("userId") ?? 0) },
          imageUrl: "",
        });
        setSuccess(false);
        setLoading(false);
        navigate("/seller");
      }, 1600);
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add/edit product. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-10 flex bg-blue-50 min-h-screen">
        <Sidebar role="seller" />
        <main className="flex-1 ml-64 px-6 py-12 flex items-center justify-center">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-10 border border-blue-100">
            <h1 className="text-4xl font-extrabold text-center mb-3 text-blue-700 drop-shadow">
              {productId ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-center text-gray-500 mb-9">
              {productId
                ? "Update your product details below."
                : "Fill in the details to add a fresh product."}
            </p>
            {error && (
              <p className="text-red-600 text-center mb-4 font-medium bg-red-50 border border-red-200 px-2 py-1 rounded">
                {error}
              </p>
            )}
            {success && (
              <div className="flex justify-center mb-4">
                <span className="inline-block px-4 py-2 font-semibold bg-green-100 text-green-700 rounded border border-green-200 shadow">
                  {productId
                    ? "Product updated successfully!"
                    : "Product added successfully!"}
                </span>
              </div>
            )}
            <form
              onSubmit={handleSubmit}
              className="space-y-7"
              autoComplete="off"
              spellCheck="false"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block font-bold mb-1 text-blue-900">
                    Product Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="border-2 border-blue-200 rounded-lg w-full px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:bg-blue-50 transition-all duration-150"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block font-bold mb-1 text-blue-900">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={form.category.id}
                    onChange={handleChange}
                    className="border-2 border-blue-200 rounded-lg w-full px-3 py-2 focus:ring-2 focus:ring-blue-400 bg-white transition-all duration-150"
                    required
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block font-bold mb-1 text-blue-900">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  className="border-2 border-blue-200 rounded-lg w-full px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:bg-blue-50 resize-none transition-all duration-150"
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="pricePerUnit" className="block font-bold mb-1 text-blue-900">
                    Price (D)
                  </label>
                  <input
                    id="pricePerUnit"
                    type="number"
                    name="pricePerUnit"
                    min={0}
                    value={form.pricePerUnit}
                    onChange={handleChange}
                    className="border-2 border-blue-200 rounded-lg w-full px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:bg-blue-50 transition-all duration-150"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="stockQuantity" className="block font-bold mb-1 text-blue-900">
                    Quantity
                  </label>
                  <input
                    id="stockQuantity"
                    type="number"
                    name="stockQuantity"
                    min={0}
                    value={form.stockQuantity}
                    onChange={handleChange}
                    className="border-2 border-blue-200 rounded-lg w-full px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:bg-blue-50 transition-all duration-150"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center">
                <label htmlFor="image" className="block font-bold mr-4 text-blue-900 w-32">
                  Image Upload
                </label>
                <div className="flex-1">
                  <input
                    id="image"
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                    className="block w-full text-gray-700 focus:outline-none file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-100 file:text-blue-700
                      hover:file:bg-blue-200 transition-all"
                  />
                  {form.imageUrl && (
                    <span className="block mt-1 text-xs text-gray-700 truncate">
                      Selected: <span className="font-semibold">{form.imageUrl}</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button
                  type="submit"
                  disabled={success || loading}
                  className={`px-8 py-2 rounded-lg font-bold bg-gradient-to-r from-blue-600 to-blue-500 shadow-md text-white transition-all duration-150
                    ${success || loading ? "opacity-60 cursor-not-allowed" : "hover:from-blue-700 hover:to-blue-600"}`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-white inline-block" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4zm2 5.291A7.962 7.962 0 014 12H0c0 2.48.903 4.742 2.383 6.594l2.117-1.303zm13.243-2.596a7.978 7.978 0 004.374-7.046h-4c0 1.488-.472 2.865-1.271 3.978l2.897 3.068zm-2.047 1.12l-2.117 1.304C19.097 16.741 20 14.48 20 12h-4a7.964 7.964 0 01-1.243 4.291z"/>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    productId ? "Update Product" : "Add Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}