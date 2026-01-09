import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import type { CartItem } from "../models/modelTypes";


export default function Checkout(){
    const navigate = useNavigate();
    const {state} = useLocation();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<Boolean>(false);
    const API_URL = import.meta.env.VITE_API_URL;

    const cartItems: CartItem[] = state?.cartItems;

    const total = cartItems.reduce((acc, item) => acc + item.product.pricePerUnit* item.quantity, 0);
    const [partToDisplay, setpartToDisplay] = useState("Shipping Details");
    const [shippingDetails, setShippingDetails] = useState({
        address: "",
        phone_number: "",
        city: "",
        postal_code: "",
    });
    const [shippingDetailsId, setShippingDetailsId] = useState<number>(0);

    const [orderId, setOrderId] = useState<number>(0);

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target as HTMLInputElement;
        setShippingDetails({ ...shippingDetails, [name]: value });
    };

    const handleShippingDetailsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

    try {

        const response = await axios.post(`${API_URL}/shipping-details`, shippingDetails, {
        headers: {
            "Content-Type": "application/json",
        },
        });
        setShippingDetailsId(response.data.id);
        setSuccess(true);

        setTimeout(() => {
            setShippingDetails({
                address: "",
                phone_number: "",
                city: "",
                postal_code: "",
            });
            setpartToDisplay('Order Summary')
        }, 1000)

        
    } catch (err) {
        console.error("Error adding category:", err);
    } 
    }

    const createOrder = async (): Promise<number> => {

        const order  = {
            orderStatus: "PENDING",
            orderDate: new Date(),
            totalPrice: total,
            shippingDetails: {id: shippingDetailsId},
            customer: {id: Number(sessionStorage.getItem("userId"))}
        };

        const response = await axios.post(`${API_URL}/order`, order, {
        headers: {
            "Content-Type": "application/json",
        },
        }); 
       return response.data.id;

    }

   const createOrderItems = async (orderId: number) => {
    const requests = cartItems.map((item) => {
        const orderItem = {
        product: { id: item.product.id },
        quantity: item.quantity,
        priceAtPurchase: item.product.pricePerUnit,
        order: { id: orderId },
        };

        return axios.post(`${API_URL}/order-items`, orderItem);
    });

    await Promise.all(requests);
};


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const cartId = cartItems[0].cart.id;
    console.log(cartId);
    const newOrderId = await createOrder();
    setOrderId(newOrderId);
    await createOrderItems(newOrderId);
    //await axios.delete(`http://localhost:8080/cart-items/${cartId}`)
    navigate("/customer")
  } catch (err) {
    console.error("Failed to place order:", err);
  } finally {
    setLoading(false);
  }
};


    return(
        
        <>
        <Navbar />
        <main className="max-w-4xl mx-auto py-8 px-6 mt-16">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            <form className="space-y-8" onSubmit={handleSubmit}>
                {partToDisplay === "Shipping Details" && (
                <section>
                    <h2 className="font-semibold text-xl mb-4"> Shipping Detail:</h2>
                    <div className="grid grid-cols-2 gap-6">
                        
                        <div> 
                            <label htmlFor="address" className="font-medium block mb-1">Shipping Adress:</label>
                            <input id="address" name="address" value={shippingDetails.address} onChange={handleChange} type="text" className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"></input>
                        </div>

                         <div> 
                            <label htmlFor="phone_number" className="font-medium block mb-1">Phone Number:</label>
                            <input id="phone_number" name="phone_number" value={shippingDetails.phone_number} onChange={handleChange} type="tel" className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"></input>
                        </div>

                         <div> 
                            <label htmlFor="city" className="font-medium block mb-1">City:</label>
                            <input id="city" name="city" value={shippingDetails.city} onChange={handleChange} type="text" className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"></input>
                        </div>

                         <div> 
                            <label htmlFor="postal_code" className="font-medium block mb-1">Postal Code:</label>
                            <input id="postal_code" name="postal_code" value={shippingDetails.postal_code} onChange={handleChange} type="text" className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"></input>
                        </div>
                        <button onClick={handleShippingDetailsSubmit} className="bg-blue-900 py-3 px-6 rounded text-white hover:bg-blue-800">Proceed</button>
                    </div>
                </section>
                )}


                {partToDisplay === "Payment Details" && (
                <section>
                    <h2 className="text-xl font-semibold mb-4">Payment Details:</h2>
                    <div className="grid grid-cols-1 gap-6 max-w-md">
                        <div>
                            <label htmlFor="cardNumber" className="block font-medium mb-1">Card Number</label>
                            <input id="cardNumber" type="text" className="border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"></input>
                        </div>

                        <div>
                            <label htmlFor="expiryDate" className="block font-medium mb-1">Expiry Date</label>
                            <input id="expiryDate" type="text" className="border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"></input>
                        </div>

                        <button onClick={() => setpartToDisplay('Order Summary')} className="bg-blue-900 py-3 px-6 rounded text-white hover:bg-blue-800">Proceed</button>
                    </div>
                </section>
                )}

                {partToDisplay === "Order Summary" && (
                <>
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <ul className="border rounded space-y-4 p-4 text-gray-700">
                            {cartItems.map(item => 
                            <li className="flex justify-between" key={item.id}>
                                <span>{item.product.name} x {item.quantity} kg</span>
                                <span>D{item.product.pricePerUnit * item.quantity}</span>
                            </li>
                            )}

                            {/* <li className="flex justify-between">
                                <span>Sea Bass x 2 kg</span>
                                <span>$24</span>
                            </li> */}

                            <li className="flex justify-between text-blue-900 border-t pt-2 font-semibold">
                                <span>Total</span>
                                <span>D{total}</span>
                            </li>
                        </ul>
                    </section>
                    <button type="submit" className="bg-blue-900 text-white px-6 py-3 rounded hover:bg-blue-800">
                       {loading ? "Processing..." : "Order"}
                    </button>
                </>
                )}
            </form>
        </main>
        </>
    );
}