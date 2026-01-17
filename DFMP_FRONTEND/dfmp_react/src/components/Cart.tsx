import {  useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { useState, useEffect } from "react";
import type { CartItem } from "../models/modelTypes";
import { LuShoppingBag, LuArrowLeft } from "react-icons/lu";

  // This is the page that displays the cart of a customer with its cartItems. Whe it loads, it fetches the
  // cart and its cart items from the backend and stores them in a variable. On the page, there is a buttion 
  // that removes an item from the cart. When it is clicked, it calls the handleRemove function which removes
  // the item from the cart and then re-displays the remaining items on the cart. There is also a checkout
  // button which when clicked calls the checkout function. This checkout function then takes you to the 
  // checkout page sending the items on the cart along.

export default function Cart(){

    const navigate = useNavigate();
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState("");
    // const [customerCart, setCustomerCart] = useState<number>(0);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const API_URL = import.meta.env.VITE_API_URL;


    useEffect(() => {
        const customer= sessionStorage.getItem("userId");
        const fetchCustomerCart = async () => {
        try {
            const response1 = await axios.post(`${API_URL}/carts/customer`, { id: Number(customer)});
            // setCustomerCart(response1.data.id);
            const response2 = await axios.post(`${API_URL}/cart-items/cart`, { id: response1.data.id});
            setCartItems(response2.data);
        } catch (err) {
            // setError("Failed to load featured products");
        } finally {
            // setLoading(false);
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
    navigate("/checkout", {state: {cartItems}})
  }


  const handleQuantityChange = async (id: number, newQty: number, item: CartItem) => {
    if (newQty < 1) return; 

    try {
      await axios.put(`${API_URL}/cart-items/${item.id}`, { id: item.id, cart: item.cart, product: item.product, quantity: newQty}); 
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQty } : item
        )
      );
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

    if (cartItems.length === 0) {
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
                <button  className="h-10 rounded-md px-4  bg-blue-700 text-white">
                  <LuArrowLeft size={20} className="inline mr-1"/>
                   Continue Shopping
                </button>
              </Link>
            </div>
          </main>
        </div>
      </>
    );
  }

    return(
        <>
        <Navbar />
        
        <main className="m-6 mt-16 pt-8">
            <h1 className="mb-6 font-bold text-2xl">Cart Items List: </h1>
            <div className="">
                <table className="border-collapse text-left w-full">
                    <thead>
                        <tr className="bg-gray-200 border-b">
                            {/* <th className="py-3 px-4 ">Image</th> */}
                            <th className="py-3 px-4 ">Product Name</th>
                            <th className="py-3 px-4 ">Price</th>
                            <th className="py-3 px-4 ">Quantity</th>
                            <th className="py-3 px-4 ">Total</th>
                            <th className="py-3 px-4 ">Action</th>
                        </tr>
                    </thead>
                    
                    <tbody className="">
                        {[...cartItems]
                        .sort((a, b) => b.id - a.id)
                        .map((item) => 
                        <tr className="border-b" key = {item.id}>
                            {/* <td className="py-3 px-4">{item.image}</td> */}
                            <td className="py-3 px-4">{item.product.name}</td>
                            <td className="py-3 px-4">D{item.product.pricePerUnit}</td>
                            <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                            <button
                                className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() =>
                                handleQuantityChange(item.id, item.quantity-1, item)
                                }
                            >
                                -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                                className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1, item)
                                }
                            >
                                +
                            </button>
                            </div>
                        </td>
                            <td className=" py-3 px-4 font-semibold">D{item.quantity * item.product.pricePerUnit}</td>
                            <td
                                className="py-3 px-4 text-red-600 hover:underline hover:cursor-pointer"
                                onClick={() => handleRemove(item.id)}
                            >
                                Remove
                            </td>
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <h1 className="mt-8 text-xl mb-3 font-semibold">Cart Summary: </h1>
            <div className="flex justify-between">
                <div className="font-semibold text-lg">D{total}</div>
                {cartItems.length &&
                    <button onClick={chekout} className="bg-blue-900 py-3 px-6 rounded text-white hover:bg-blue-800">Checkout</button>
                }
            </div>
        </main>

         </>

    );
}