import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import { useEffect, useState } from "react";
import axios from "axios";
import type { Product } from "../models/modelTypes";

// This is the page that is displays when a person visits the site because it has the default route which is
//  '/'. When is displays, it fetch all the products in the system and store them in the products state.
//  It wraps the nav bar, hero section, category section and featured product section and also the footer.

export default function LandingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        setProducts(response.data);
      } catch (err) {
        // setError("Failed to load featured products");
      } finally {
        // setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const categories = [
    { name: "Fish", img: "barbel_whole.jpg" },
    { name: "Prawns", img: "abalone_fresh.jpg" },
    { name: "Crabs", img: "crab_meat_lump.jpg" },
    { name: "Lobsters", img: "lobster_whole.jpg" },
  ];

  const benefits = [
    { icon: "✔️", text: "Certified Sellers" },
    { icon: "🚚", text: "Fast Delivery" },
    { icon: "🌱", text: "Sustainably Sourced" },
  ];

  return (
    <>
      <Navbar />

      <main className="pt-24 bg-gradient-to-b from-blue-50 via-white to-blue-100 min-h-screen">

        <Hero />

        {/* Enhanced Categories Section */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-blue-900 text-center tracking-tight underline decoration-blue-400 decoration-2 underline-offset-4">Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/shop`}
                className="group rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all border border-blue-200 bg-white"
              >
                <div className="relative">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70 group-hover:opacity-60 transition-opacity duration-200" />
                </div>
                <p className="text-center py-4 text-lg font-semibold text-blue-800 bg-blue-50 group-hover:bg-blue-100 transition">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Enhanced Featured Products Section */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 tracking-tight">Featured Products</h2>
            <Link to="/shop" className="text-blue-600 hover:text-blue-800 font-semibold rounded-full border border-blue-200 px-5 py-1.5 text-sm transition-shadow hover:shadow-md">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.slice(1, 5).map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.pricePerUnit}
                image={product.imageUrl}
              />
            ))}
          </div>
        </section>

        {/* Enhanced Benefits Section */}
        <section className="py-16 bg-gradient-to-r from-blue-100 via-white to-blue-200">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 text-center mb-10 tracking-wide">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:bg-blue-50 transition"
                >
                  <div className="text-5xl md:text-6xl mb-4 drop-shadow">{benefit.icon}</div>
                  <p className="font-bold text-blue-800 text-center text-lg">{benefit.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}