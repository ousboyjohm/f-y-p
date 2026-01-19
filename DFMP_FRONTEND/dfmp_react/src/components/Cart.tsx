import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { useState, useEffect } from "react";
import type { CartItem } from "../models/modelTypes";
import { LuShoppingBag, LuArrowLeft } from "react-icons/lu";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const customer = sessionStorage.getItem("userId");
    const fetchCustomerCart = async () => {
      try {
        const response1 = await axios.post(`${API_URL}/carts/customer`, { id: Number(customer) });
        const response2 = await axios.post(`${API_URL}/cart-items/cart`, { id: response1.data.id });
        setCartItems(response2.data);
      } catch (err) {
        // handle error as needed
      }
    };
    fetchCustomerCart();
  }, []);

  const total = cartItems.reduce((acc, item) => acc + item.product.pricePerUnit * item.quantity, 0);

  const handleRemove = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/cart-items/${id}`);
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const chekout = () => {
    navigate("/checkout", { state: { cartItems } });
  };

  const handleQuantityChange = async (id: number, newQty: number, item: CartItem) => {
    if (newQty < 1) return;

    try {
      await axios.put(`${API_URL}/cart-items/${item.id}`, { id: item.id, cart: item.cart, product: item.product, quantity: newQty });
      setCartItems((prev) =>
        prev.map((ci) =>
          ci.id === id ? { ...ci, quantity: newQty } : ci
        )
      );
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  if (cartItems.length === 0) {
    // Don't touch empty cart design
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <main className="max-w-7xl mx-auto px-4 py-50">
            <div className="text-center py-12">
              <LuShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
              <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
              <Link to="/shop">
                <button className="h-10 rounded-md px-4  bg-blue-700 text-white">
                  <LuArrowLeft size={20} className="inline mr-1" />
                  Continue Shopping
                </button>
              </Link>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="m-6 mt-20 pt-8 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="mx-auto max-w-5xl shadow-2xl bg-white/80 rounded-xl p-6 border border-blue-100">
          <h1 className="mb-8 font-extrabold text-3xl text-blue-900 drop-shadow text-center">
            Your Shopping Cart
          </h1>
          <div className="overflow-x-auto rounded-lg">
            <table className="border-collapse w-full bg-white shadow-lg rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-blue-100 text-blue-900 uppercase text-sm tracking-wider">
                  {/* <th className="py-3 px-4 ">Image</th> */}
                  <th className="py-4 px-4">Product Name</th>
                  <th className="py-4 px-4 text-center">Price</th>
                  <th className="py-4 px-4 text-center">Quantity</th>
                  <th className="py-4 px-4 text-center">Total</th>
                  <th className="py-4 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {[...cartItems]
                  .sort((a, b) => b.id - a.id)
                  .map((item) => (
                    <tr className="border-b hover:bg-blue-50 transition" key={item.id}>
                      {/* <td className="py-4 px-4">{item.image}</td> */}
                      <td className="py-4 px-4 font-semibold">{item.product.name}</td>
                      <td className="py-4 px-4 text-center text-blue-800 font-medium">
                        D{item.product.pricePerUnit}
                      </td>
                      <td className="py-4 px-4 text-center min-w-[140px]">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full text-blue-700 hover:bg-blue-200 font-bold transition-all text-lg"
                            aria-label="Decrease quantity"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1, item)
                            }
                          >
                            -
                          </button>
                          <span className="text-lg font-bold w-8 text-center">{item.quantity}</span>
                          <button
                            className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full text-blue-700 hover:bg-blue-200 font-bold transition-all text-lg"
                            aria-label="Increase quantity"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1, item)
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-blue-900">
                        D{item.quantity * item.product.pricePerUnit}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          className="px-4 py-1 rounded-full border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-800 transition-all font-medium"
                          onClick={() => handleRemove(item.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="bg-blue-50 p-6 rounded-xl shadow w-full md:w-fit">
              <h2 className="text-xl font-bold text-blue-800 mb-2">Cart Summary</h2>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Subtotal:</span>
                <span className="font-bold text-lg text-blue-900 ml-4">D{total}</span>
              </div>
              {/* Could add other summary elements/taxes here */}
            </div>
            {cartItems.length ? (
              <button
                onClick={chekout}
                className="bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg py-4 px-10 rounded-xl text-white text-lg font-bold hover:from-blue-800 hover:to-blue-950 transition-all w-full md:w-auto"
              >
                Checkout
              </button>
            ) : null}
          </div>
        </div>
      </main>
    </>
  );
}