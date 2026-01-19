import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import type { Order, OrderItem } from "../models/modelTypes";
import { useLocation } from "react-router-dom";

function statusBadge(status: string | undefined) {
  if (!status) return null;
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${
        status === "DELIVERED"
          ? "bg-green-100 text-green-700"
          : status === "PENDING"
          ? "bg-yellow-100 text-yellow-700"
          : status === "PROCESSING"
          ? "bg-blue-100 text-blue-700"
          : status === "SHIPPED"
          ? "bg-orange-100 text-orange-700"
          : "bg-gray-200 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

function OrderProgress({ order }: { order: Order }) {
  // Step mapping:
  // PENDING -> step 0, PROCESSING -> 1, SHIPPED -> 2, DELIVERED -> 3
  // steps: Pending, Processing, Shipped, Delivered
  const steps = [
    { label: "Pending" },
    { label: "Processing" },
    { label: "Shipped" },
    { label: "Delivered" },
  ];
  let statusIdx = 0;
  switch (order.orderStatus) {
    case "DELIVERED":
      statusIdx = 3;
      break;
    case "SHIPPED":
      statusIdx = 2;
      break;
    case "PROCESSING":
      statusIdx = 1;
      break;
    case "PENDING":
    default:
      statusIdx = 0;
      break;
  }
  return (
    <div className="flex flex-col items-center w-full mt-2 mb-2">
      <div className="w-full flex justify-between items-center mb-3">
        {steps.map((step, idx) => (
          <div className="flex-1 flex flex-col items-center" key={step.label}>
            <div
              className={`h-9 w-9 flex items-center justify-center rounded-full border-2 text-base transition-all duration-200 ${
                idx <= statusIdx
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                  : "bg-white text-gray-400 border-gray-300"
              }`}
            >
              {idx + 1}
            </div>
            <span
              className={`mt-2 text-xs tracking-wide ${
                idx <= statusIdx ? "text-blue-800 font-semibold" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full h-1 bg-blue-100 rounded relative">
        <div
          className="absolute h-1 bg-blue-500 rounded transition-all duration-300"
          style={{ width: `${(statusIdx / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

function ProfileCard({ profile }: { profile: any }) {
  if (!profile) return null;
  return (
    <div className="bg-gradient-to-tr from-blue-100 via-white to-blue-200 rounded-2xl shadow-lg p-7 flex flex-col items-center border border-blue-100 mb-10">
      <div className="relative">
        <img
          src="/avatar-placeholder.png"
          className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
          alt="profile"
        />
        <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
      </div>
      <h2 className="font-semibold text-xl text-blue-900 mt-5 mb-1 tracking-tight">
        {profile.name}
      </h2>
      <p className="text-sm text-gray-500 mb-1">{profile.email}</p>
      <p className="text-xs text-blue-800 font-medium">
        Joined: {new Date(profile.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

export default function CustomerDashboard() {
  const [partToDisplay, setpartToDisplay] = useState("Dashboard");
  const [orders, setOrder] = useState<Order[]>([]);
  const [orderItem, setOrderItem] = useState<OrderItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  // const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<any>(null);

  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const customer = sessionStorage.getItem("userId");
    if (location.state?.section) {
      setpartToDisplay(location.state.section);
    }
    const fetchProfile = async () => {
      try {
        if (customer) {
          const result = await axios.get(`${API_URL}/customer/${customer}`);
          setProfile(result.data);
        }
      } catch {}
    };
    const fetchOrdersAndItems = async () => {
      try {
        setLoading(true);
        const ordersResponse = await axios.post(
          `${API_URL}/order/customer`,
          { id: Number(customer) }
        );
        const fetchedOrders = ordersResponse.data ?? [];
        setOrder(fetchedOrders);
        setRecentOrders([...fetchedOrders].slice(-5).reverse());

        const requests = fetchedOrders.map((order: Order) =>
          axios.post(`${API_URL}/order-items/order`, {
            id: order.id,
          })
        );
        const results = await Promise.all(requests);
        const allOrderItems = results.flatMap(res => res.data);
        setOrderItem(allOrderItems);
      } catch (err: any) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    fetchOrdersAndItems();
    // eslint-disable-next-line
  }, [location.state]);

  const totalSpent = orders.reduce((acc, o) => acc + (Number(o.totalPrice) || 0), 0);

  // For modern UX: open modals, proper states etc.
  const [trackOrderId, setTrackOrderId] = useState<number | null>(null);
  const [trackOrderModal, setTrackOrderModal] = useState(false);

  function openTrackOrder(id: number) {
    setTrackOrderId(id);
    setTrackOrderModal(true);
  }

  function closeTrackOrder() {
    setTrackOrderModal(false);
    setTrackOrderId(null);
  }

  const orderToTrack = orders.find(o => o.id === trackOrderId);

  return (
    <>
      <Navbar />
      <div className="pt-24 flex bg-gradient-to-r from-blue-50/80 via-white to-blue-100/80 min-h-screen">
        {/* Sidebar */}
        <Sidebar
          role="customer"
          onNavigate={setpartToDisplay}
          current={partToDisplay}
        />

        {/* Main Content */}
        <main className="flex-1 ml-64 px-10 py-10">
          {loading ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="text-xl text-blue-900 font-medium">
                Loading your dashboard...
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 text-lg py-10">{error}</div>
          ) : (
            <>
              {partToDisplay === "Dashboard" && (
                <>
                  {/* Profile and Stats Card */}
                  <div className="grid grid-cols-1 gap-0 md:grid-cols-3 md:gap-7 mb-12">
                    <div>
                      <ProfileCard profile={profile} />
                    </div>
                    <div className="col-span-2 flex flex-col items-stretch justify-between">
                      <h1 className="text-4xl font-black text-blue-950 mb-8 tracking-tight drop-shadow-blue">
                        Welcome{profile?.name ? `, ${profile.name}` : ""}.
                      </h1>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
                        <div className="rounded-2xl bg-blue-800 px-8 py-7 shadow-xl flex flex-col items-center">
                          <span className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow text-2xl">
                            <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
                              <path d="M12 2V22M2 12H22" stroke="currentColor" strokeWidth="2.2"/>
                              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.2"/>
                            </svg>
                          </span>
                          <div className="text-white text-base mb-1">Orders</div>
                          <div className="text-3xl font-black text-blue-100">{orders.length}</div>
                        </div>
                        <div className="rounded-2xl bg-white px-8 py-7 shadow-xl flex flex-col items-center border border-blue-100">
                          <span className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-200 text-blue-800 text-2xl shadow">
                            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                              <rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" className="text-blue-400"/>
                              <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                            </svg>
                          </span>
                          <div className="text-blue-700 text-base mb-1">Items Bought</div>
                          <div className="text-3xl font-black">{orderItem.length}</div>
                        </div>
                        <div className="rounded-2xl bg-gradient-to-br from-blue-200/60 to-white px-8 py-7 shadow-xl flex flex-col items-center border border-blue-100">
                          <span className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-white text-blue-700 shadow text-2xl">
                            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                              <path d="M12 21V19M6.998 17.385A7 7 0 1112 19c-1.326 0-2.588-.258-3.728-.74-.396-.168-.81.154-.802.583v0c.01.462.54.71.93.49z" stroke="currentColor" strokeWidth="2.2" />
                            </svg>
                          </span>
                          <div className="text-blue-700 text-base mb-1">Total Spent</div>
                          <div className="text-3xl font-black">D{totalSpent}</div>
                        </div>
                        <div className="rounded-2xl bg-gradient-to-br from-white to-blue-100 px-8 py-7 shadow-xl flex flex-col items-center border border-blue-50">
                          <span className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-900 text-2xl shadow">
                            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                              <path d="M18 10C19.1046 10 20 10.8954 20 12C20 13.1046 19.1046 14 18 14M6 10C4.89543 10 4 10.8954 4 12C4 13.1046 4.89543 14 6 14M8 20H16M12 20V4" stroke="currentColor" strokeWidth="2.0" />
                            </svg>
                          </span>
                          <div className="text-blue-700 text-base mb-1">Last Status</div>
                          <div className="text-lg font-bold">
                            {orders.length > 0
                              ? statusBadge(
                                  (orders
                                    .filter(o => !!o.orderDate)
                                    .sort(
                                      (a, b) =>
                                        new Date(b.orderDate!).getTime() -
                                        new Date(a.orderDate!).getTime()
                                    )[0] ?? orders[orders.length - 1]
                                  ).orderStatus
                                )
                              : "--"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders Table */}
                  <div className="bg-white/90 rounded-2xl shadow-xl p-6 mb-10 border border-blue-100">
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="text-xl font-bold text-blue-900 tracking-tight">
                        Recent Orders
                      </h2>
                    </div>
                    <div className="overflow-x-auto custom-scroll">
                      <table className="min-w-full divide-y divide-blue-100">
                        <thead>
                          <tr className="text-blue-900 text-sm font-bold">
                            <th className="px-4 py-2 text-left">Order #</th>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Total</th>
                            <th className="px-4 py-2">Track</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-7 text-center text-gray-400">
                                No recent orders found.
                              </td>
                            </tr>
                          ) : (
                            recentOrders.map(order => (
                              <tr key={order.id} className="hover:bg-blue-50 transition">
                                <td className="px-4 py-2">{order.id}</td>
                                <td className="px-4 py-2">
                                  {order.orderDate && new Date(order.orderDate).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2">{statusBadge(order.orderStatus)}</td>
                                <td className="px-4 py-2">D{order.totalPrice}</td>
                                <td className="px-4 py-2">
                                  <button
                                    className="px-3 py-1 rounded bg-blue-100 text-blue-800 font-semibold hover:bg-blue-800 hover:text-white transition shadow-sm"
                                    onClick={() => openTrackOrder(order.id)}
                                  >
                                    Track
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* Modernized Recent Orders Page */}
              {partToDisplay === "Recent Orders" && (
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-blue-900 mb-6">
                    Products in All Orders
                  </h2>
                  <div className="bg-white rounded-2xl shadow p-6 border border-blue-100">
                    <ul className="space-y-3">
                      {orderItem.length === 0 ? (
                        <li className="text-center text-gray-400 py-8">
                          No products found in your orders.
                        </li>
                      ) : (
                        orderItem.map((oi) => (
                          <li
                            key={oi.id}
                            className="flex justify-between items-center bg-blue-50 p-4 rounded shadow"
                          >
                            <div>
                              <div className="font-semibold text-blue-950">
                                {oi.product.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                Order #{oi.order.id} · Qty: {oi.quantity}
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className={`mb-1`}>
                                {statusBadge(oi.order.orderStatus)}
                              </span>
                              <button
                                className="text-xs px-2 py-1 rounded underline hover:text-blue-800 transition"
                                onClick={() => openTrackOrder(oi.order.id)}
                              >
                                Track Order
                              </button>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </section>
              )}

              {/* Track Order Modern Modal */}
              {(trackOrderModal && orderToTrack) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                  <div className="bg-white rounded-2xl shadow-xl p-8 w-[90vw] max-w-lg relative border-2 border-blue-200">
                    <button
                      className="absolute right-4 top-3 text-gray-400 hover:text-blue-900 text-3xl"
                      onClick={closeTrackOrder}
                      aria-label="Close"
                    >
                      &times;
                    </button>
                    <h3 className="font-extrabold text-2xl mb-3 text-blue-950">
                      Track Order #{orderToTrack.id}
                    </h3>
                    <p className="mb-1 text-blue-800 text-xs font-bold">
                      Placed: {orderToTrack.orderDate && new Date(orderToTrack.orderDate).toLocaleString()}
                    </p>
                    <p className="mb-1">
                      Status: <span>{statusBadge(orderToTrack.orderStatus)}</span>
                    </p>
                    <p className="mb-1">
                      Total: <span className="font-semibold text-blue-900">D{orderToTrack.totalPrice}</span>
                    </p>
                    <hr className="my-3" />
                    <div className="mb-4">
                      <span className="font-semibold text-blue-800">Order Progress</span>
                      <OrderProgress order={orderToTrack} />
                    </div>
                    <div>
                      <span className="font-semibold">Products:</span>
                      <ul className="mt-1 ml-3 list-disc text-sm text-left">
                        {orderItem
                          .filter((oi) => oi.order.id === orderToTrack.id)
                          .map((oi) => (
                            <li key={oi.id}>
                              {oi.product.name} <span className="text-xs text-gray-500">(x{oi.quantity})</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Track order: default single most recent order card when "Track Order" nav clicked */}
              {partToDisplay === "Track Order" && (
                <section className="flex items-center flex-col">
                  <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow flex flex-col items-center justify-center text-center">
                    <h4 className="text-lg font-bold mb-4 text-blue-900">Most Recent Order</h4>
                    {orders.length === 0 ? (
                      <span className="text-gray-400">No orders available.</span>
                    ) : (
                      <>
                        <div className="mb-1">
                          <span className="inline-block px-3 py-2 rounded-full bg-blue-100 font-semibold text-blue-900 text-xl">
                            #{orders[orders.length - 1].id}
                          </span>
                        </div>
                        <div className="font-medium text-lg mb-2">
                          {statusBadge(orders[orders.length - 1].orderStatus)}
                        </div>
                        <OrderProgress order={orders[orders.length - 1]} />
                        <div className="mt-1 text-gray-600 text-sm font-mono">
                          Date:{" "}
                          {orders[orders.length - 1].orderDate
                            ? orders[orders.length - 1].orderDate.split("T")[0]
                            : "--"}
                        </div>
                        <div className="mb-3 text-gray-600 text-sm font-mono">
                          Time:{" "}
                          {orders[orders.length - 1].orderDate
                            ? (orders[orders.length - 1].orderDate.split("T")[1]?.split(".")[0]?.slice(0, 5) || "--")
                            : "--"}
                        </div>
                        <div>
                          <span className="font-semibold">Products:</span>
                          <ul className="mt-1 ml-3 list-disc text-sm text-left">
                            {orderItem
                              .filter(oi => oi.order.id === orders[orders.length - 1].id)
                              .map(oi => (
                                <li key={oi.id}>
                                  {oi.product.name} <span className="text-xs text-gray-500">(x{oi.quantity})</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>
      {/* <Footer /> */}
    </>
  );
}