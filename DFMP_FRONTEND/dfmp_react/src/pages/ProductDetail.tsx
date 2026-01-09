import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import type { Product } from "../models/modelTypes";


export default function ProductDetail() {
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);

  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState(localStorage.getItem("userId"));
  const [customerCart, setCustomerCart] = useState<number>(0);
  const API_URL = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const fetchProduct = async () => {
      try {
          await axios.get<Product>(`${API_URL}/products/${id}`)
          .then(response => {
            setProduct(response.data);
          }
          );   
          
          const response = await axios.post(`${API_URL}/carts/customer`, { id: Number(customer)});
          setCustomerCart(response.data.id);
      } catch (err) {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (id && customer) fetchProduct();
  }, [id, customer]);


  const addToCart = async () => {
    if (!product || !customerCart) return;

    const cartItem = {
      product: { id: product.id },
      quantity: quantity,
      cart: { id: customerCart },
    };

    await axios.post(`${API_URL}/cart-items`,  cartItem, {
        headers: {
            "Content-Type": "application/json",
        },
        }); 
        navigate("/cart")
    }

  const relatedProducts = [
    { id: 1, name: "Tilapia", price: 250, image: "chad-montgomery-ULq-CC_Q7iY-unsplash.jpg" },
    { id: 2, name: "Crab", price: 500, image: "sebastien-devocelle-RnjSj-m6PSg-unsplash.jpg" },
    { id: 3, name: "Lobster", price: 1200, image: "pexels-mali-229789.jpg" },
  ];

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // if (loading) return <Loader />;
  // if (error) return <Alert type="error" message={error} />;
  // if (!product) return <p className="p-6">Product not found.</p>;

  return (
    <>
      <Navbar />
      
      <main className="pt-24 max-w-7xl mx-auto px-6 py-12">
 
        <nav className="text-gray-600 text-sm mb-6">
          <Link to="/" className="hover:underline">Home</Link> &gt;{" "}
          <Link to="/shop" className="hover:underline">Shop</Link> &gt; {product?.name}
        </nav>

        <div className="flex flex-col md:flex-row gap-12">

          <div className="md:w-1/2">
            <img src={`/${product?.imageUrl}`} alt={product?.name} className="w-full h-96 object-cover rounded" />
          </div>


          <div className="md:w-1/2 flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-gray-800">{product?.name}</h1>
            <p className="text-xl text-blue-900 font-semibold">D{product?.pricePerUnit}</p>
            {/* <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < product.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
              ))}
            </div> */}
            <p className="text-gray-700">{product?.description}</p>


            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={decreaseQty}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span className="font-semibold">{quantity}</span>
              <button
                onClick={increaseQty}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>


            <button onClick={addToCart} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded w-40">
              Add to Cart
            </button>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
      </main>

      <Footer />
    </>
  );
}