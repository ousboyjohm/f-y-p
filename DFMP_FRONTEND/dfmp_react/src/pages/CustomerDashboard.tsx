import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import type { Order, OrderItem } from "../models/modelTypes";
import { useLocation } from "react-router-dom";

const recentOrders = [
  { id: "12345", product: "Tilapia", status: "Delivered" },
  { id: "12346", product: "Crab", status: "In Transit" },
  { id: "12347", product: "Lobster", status: "Pending" },
];

export default function CustomerDashboard() {

  const [partToDisplay, setpartToDisplay] = useState("Dashboard");
    const [orders, setOrder] = useState<Order[]>([]);
    const [orderItem, setOrderItem] =useState<OrderItem[]>([]);
    const [customer, setCustomer] = useState(sessionStorage.getItem("userId"));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const location = useLocation();
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
      if (location.state?.section) {
        setpartToDisplay(location.state.section);
      }

      const fetchOrdersAndItems = async () => {
        try {
          setLoading(true);

          const ordersResponse = await axios.post(
            `${API_URL}/order/customer`,
            { id: Number(customer) }
          );

          const fetchedOrders = ordersResponse.data;
          setOrder(fetchedOrders);

          const requests = fetchedOrders.map((order: any) =>
            axios.post(`${API_URL}/order-items/order`, {
              id: order.id, 
            })
          );

          const results = await Promise.all(requests);

          const allOrderItems = results.flatMap(res => res.data);

          setOrderItem(allOrderItems);

        } catch (err) {
          setError("Failed to load orders");
        } finally {
          setLoading(false);
        }
    };

  fetchOrdersAndItems();
}, [customer, location.state]);

    
  return (
    <>
      <Navbar />
      <div className="pt-24 flex">
        {/* Sidebar */}
        <Sidebar role="customer"/>

        {/* Main Content */}
        <main className="flex-1 ml-64 px-6 py-12">
          {partToDisplay === "Dashboard" && (
            <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Hello, {orders[0]?.customer?.name || "Customer"}!</h1>


            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-600">Number of orders</p>
                <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-600">Recent order Status</p>
                <p className="text-2xl font-bold text-gray-800">{orders.length > 0 && orders[orders.length - 1].orderStatus}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-600">Number of Products</p>
                <p className="text-2xl font-bold text-gray-800">{orderItem.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-600">Total amount spent</p>
                <p className="text-2xl font-bold text-blue-900">D{orders.length > 0 && orders[orders.length - 1].totalPrice}</p>
              </div>
            </div>
            </>
          )}


          {partToDisplay === "Recent Orders" && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Orders Made</h2>
            <ul className="space-y-3">
              {orderItem.map((order) => (
                <li
                  key={order.id}
                  className="flex justify-between items-center bg-white p-4 rounded shadow"
                >
                  <span>
                    Order #{order.order.id} - {order.product.name}
                  </span>
                  <span className={`font-semibold ${
                    order.order.orderStatus === "DELIVERED"
                      ? "text-green-600"
                      : order.order.orderStatus === "PENDING"
                      ? "text-yellow-500"
                      : "text-gray-600"
                  }`}>
                    {order.order.orderStatus}
                  </span>
                </li>
              ))}
            </ul>
          </section>
          )}

          {partToDisplay === "Track Order" && (
          <section>
            <div className="bg-white w-64 h-64 p-6 rounded-lg shadow flex flex-col items-center justify-center text-center ml-100">
                <p className="text-gray-600">Recent Order</p>
                <p className="text-2xl font-bold text-gray-800">{orders.length > 0 && orders[orders.length-1].orderStatus}</p>
                <p className="text-gray font-bold text-gray-800">Date: {orders.length > 0 && orders[orders.length-1].orderDate.split('T')[0]}</p>
                <p className="text-gray font-bold text-gray-800">Time: {orders.length > 0 && orders[orders.length-1].orderDate.split('T')[1]  .split('.')[0]  .slice(0, 5)}</p>
              </div>
          </section>
          )}

          {/* Quick Links */}
          {/* <section className="flex gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded">
              View Orders
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded">
              Update Profile
            </button>
          </section> */}
        </main>
      </div>
      {/* <Footer /> */}
    </>
  );
}