import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import { useEffect, useState } from "react";
import axios from "axios";
import type { Product } from "../models/modelTypes";


export default function LandingPage() {

  const [products, setProducts] = useState<Product[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
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
    { name: "Fish", img: "pexels-mali-229789.jpg" },
    { name: "Prawns", img: "sebastien-devocelle-RnjSj-m6PSg-unsplash.jpg" },
    { name: "Crabs", img: "engin-akyurt-qP8zLRp4uf0-unsplash.jpg" },
    { name: "Lobsters", img: "chad-montgomery-ULq-CC_Q7iY-unsplash.jpg" },
  ];

//   const featuredProducts = [
//     { id: "1", name: "Tilapia", price: 250, image: "chad-montgomery-ULq-CC_Q7iY-unsplash.jpg" },
//     { id: "2", name: "Crab", price: 500, image: "sebastien-devocelle-RnjSj-m6PSg-unsplash.jpg" },
//     { id: "3", name: "Lobster", price: 1200, image: "pexels-mali-229789.jpg" },
//     { id: "4", name: "Prawns", price: 400, image: "chad-montgomery-ULq-CC_Q7iY-unsplash.jpg" },
// ];
  // const featuredProducts = products.slice(0, 5);

  const benefits = [
    { icon: "✔️", text: "Certified Sellers" },
    { icon: "🚚", text: "Fast Delivery" },
    { icon: "🌱", text: "Sustainably Sourced" },
  ];

  return (
    <>
      <Navbar />

      <main className="pt-24">

        {/* <section className="bg-blue-900 text-white h-96 flex flex-col justify-center items-center text-center px-6">
          <h1 className="text-4xl font-bold mb-4">
            Fresh Seafood Delivered to Your Door
          </h1>
          <Link
            to="/shop"
            className="bg-white text-blue-900 px-6 py-3 rounded-md font-semibold hover:bg-gray-100"
          >
            Shop Now
          </Link>
        </section> */}
      {/* {error && <Alert type="error" message={error}/>} */}
        <Hero />

        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/shop`}
                className="rounded-lg overflow-hidden shadow hover:shadow-lg transition"
              >
                <img src={cat.img} alt={cat.name} className="w-full h-40 object-cover" />
                <p className="text-center py-2 font-medium text-gray-800 bg-gray-100">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Products</h2>
                {/* {loading && <Loader />} */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(1,5).map((product) => (
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

        <section className="bg-blue-50 py-12">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="p-6 bg-white rounded-lg shadow">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <p className="font-semibold text-gray-800">{benefit.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}