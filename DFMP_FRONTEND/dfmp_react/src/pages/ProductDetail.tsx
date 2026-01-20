import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import type { Product } from "../models/modelTypes";

/*
  Redesigned ProductDetail page to match the style and elevated feel of LandingPage and ProductListingPage.
  Uses: 
    - blue gradients
    - elevated, soft, rounded containers
    - max-w-7xl centered layout
    - modern button styling matching Shop and LandingPage CTA
    - subtle backgrounds and sectioning for consistency
*/

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");
  const [customerCart, setCustomerCart] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const customer = sessionStorage.getItem("userId");
    const fetchProduct = async () => {
      try {
        const resp = await axios.get<Product>(`${API_URL}/products/${id}`);
        setProduct(resp.data);

        const cartResp = await axios.post(`${API_URL}/carts/customer`, { id: Number(customer) });
        setCustomerCart(cartResp.data.id);
      } catch (err) {
        // setError("Failed to load product details");
      } finally {
        // setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id, API_URL]);

  const addToCart = async () => {
    if (!sessionStorage.getItem("userId")) return navigate("/login");
    if (!product || !customerCart) return;

    const cartItem = {
      product: { id: product.id },
      quantity: quantity,
      cart: { id: customerCart },
    };

    await axios.post(`${API_URL}/cart-items`, cartItem, {
      headers: { "Content-Type": "application/json" },
    });
    navigate("/cart");
  };

  // MOCK: Related products (in a real scenario, could filter by category, or fetch from backend!)
  const relatedProducts = [
    { id: 1, name: "Tilapia", price: 250, image: "barbel_whole.jpg" },
    { id: 2, name: "Crab", price: 500, image: "crab_meat_lump.jpg" },
    { id: 3, name: "Lobster", price: 1200, image: "lobster_whole.jpg" },
  ];

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // if (loading) return <Loader />;
  // if (error) return <Alert type="error" message={error} />;
  // if (!product) return <p className="p-6">Product not found.</p>;

  return (
    <>
      <Navbar />

      {/* Soft elevated background with gradient, full viewport height */}
      <main className="pt-24 bg-gradient-to-b from-blue-50 via-white to-blue-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          {/* Breadcrumb */}
          <nav className="text-gray-600 text-sm mb-8 flex items-center">
            <Link to="/" className="hover:underline text-blue-700">Home</Link> <span className="mx-2">&gt;</span>
            <Link to="/shop" className="hover:underline text-blue-700">Shop</Link> <span className="mx-2">&gt;</span>
            <span className="font-semibold text-gray-800">{product?.name || "..."}</span>
          </nav>

          <div className="flex flex-col md:flex-row gap-10">
            {/* Product Image */}
            <div className="md:w-1/2">
              <div className="bg-white bg-opacity-80 rounded-3xl shadow-xl overflow-hidden">
                <img
                  src={`/${product?.imageUrl ?? "placeholder.jpg"}`}
                  alt={product?.name}
                  className="w-full h-96 object-cover object-center hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            {/* Product Details */}
            <div className="md:w-1/2 flex flex-col justify-center">
              <div className="bg-white bg-opacity-90 rounded-3xl shadow-lg p-8 transition-all">
                <h1 className="text-4xl font-extrabold text-blue-900 mb-3">{product?.name}</h1>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-blue-700">D{product?.pricePerUnit} /kg</span>
                  {product?.category?.name && (
                    <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-xs font-semibold">
                      {product.category.name}
                    </span>
                  )}
                </div>
                {/* Description */}
                <p className="text-gray-700 mb-6">{product?.description}</p>
                {/* Quantity controls */}
                <div className="flex items-center mb-5 gap-4">
                  <button
                    onClick={decreaseQty}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-900 text-lg font-bold hover:bg-blue-200"
                  >
                    –
                  </button>
                  <span className="text-blue-900 font-bold text-lg">{quantity} kg</span>
                  <button
                    onClick={increaseQty}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-900 text-lg font-bold hover:bg-blue-200"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={addToCart}
                  className="mt-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-xl shadow transition-all"
                >
                  Add to Cart
                </button>
                {/* <div className="mt-3 text-sm text-green-700">In Stock</div> */}
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          <section className="mt-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-blue-900 tracking-tight underline decoration-blue-400 decoration-2 underline-offset-4">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {relatedProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  id={prod.id}
                  name={prod.name}
                  price={prod.price}
                  image={`/${prod.image}`}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}