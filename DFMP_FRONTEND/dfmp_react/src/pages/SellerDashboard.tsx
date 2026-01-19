import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Product, OrderItem, Order } from "../models/modelTypes";
import axios from "axios";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { AiOutlineBarChart, AiOutlineCalendar, AiOutlineUsergroupAdd, AiOutlineShoppingCart, AiOutlineTag } from "react-icons/ai";

type BulkDiscount = {
  minQuantity: number;
  discountPercent: number;
};

function formatDate(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

// function getOrdersWithinDays(orders: OrderItem[], days: number): OrderItem[] {
//   const now = new Date();
//   return orders.filter(item => {
//     if (!item.order?.orderDate) return false;
//     const orderDate = new Date(item.order.orderDate);
//     const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
//     return diffDays < days;
//   });
// }

export default function SellerDashboard() {
  const [partToDisplay, setpartToDisplay] = useState("Dashboard");
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [bulkDiscounts, setBulkDiscounts] = useState<Record<number, BulkDiscount[]>>({});
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkConfigProductId, setBulkConfigProductId] = useState<number | null>(null);
  const [newBulkDiscount, setNewBulkDiscount] = useState<BulkDiscount>({ minQuantity: 10, discountPercent: 5 });
  
  const [currentPage, setCurrentPage] = useState(1);
  const totalPerPage = 7;
  const firstIndex = (currentPage - 1) * totalPerPage;
  const lastIndex = firstIndex + totalPerPage;
  const numOfPages = Math.ceil(products.length / totalPerPage);
  const pageNumbers = Array.from({ length: numOfPages }, (_, i) => i + 1);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [uniqueOrders, setUniqueOrders] = useState<Order[]>([]);
  const [salesView, setSalesView] = useState<"weekly" | "monthly">("weekly");

  // Fetch products and related order items for this seller
  useEffect(() => {
    const seller = sessionStorage.getItem("userId");
    if (location.state?.section) setpartToDisplay(location.state.section);

    const fetchAll = async () => {
      try {
        const response = await axios.post(`${API_URL}/products/seller`, { id: Number(seller) });
        setProducts(response.data);

        // Fetch for each product's orders
        const requests = response.data.map((product: any) =>
          axios.post(`${API_URL}/order-items/product`, { id: product.id })
        );
        const results = await Promise.all(requests);
        const allOrderItems = results.flatMap(res => res.data);
        setOrders(allOrderItems);

        // Compose unique orders for Orders tab
        const ordersMap = new Map<number, Order>();
        allOrderItems.forEach(item => {
          if (item.order) ordersMap.set(item.order.id, item.order);
        });
        setUniqueOrders(Array.from(ordersMap.values()));
      } catch { /* no-op error */ }
    };
    fetchAll();
  // eslint-disable-next-line
  }, [location.state]);

  // Bulk discount config modal helpers
  const openBulkConfig = (productId: number) => {
    setBulkConfigProductId(productId);
    setShowBulkModal(true);
    setNewBulkDiscount({ minQuantity: 10, discountPercent: 5 });
  };

  const closeBulkConfig = () => {
    setShowBulkModal(false);
    setBulkConfigProductId(null);
  };

  const handleBulkDiscountChange = (field: keyof BulkDiscount, value: number) => {
    setNewBulkDiscount(prev => ({ ...prev, [field]: value }));
  };

  const saveBulkDiscount = () => {
    if (bulkConfigProductId === null) return;
    setBulkDiscounts(prev => {
      const arr = prev[bulkConfigProductId] || [];
      return {
        ...prev,
        [bulkConfigProductId]: [...arr, { ...newBulkDiscount }]
      }
    });
    closeBulkConfig();
  };

  function handleEdit(product: Product) {
    navigate(`/add-product/${product.id}`, {state: {product}}); 
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`); 
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  // SALES CALCULATIONS & UTILITIES

  // Calculate sales for current week or month
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const ordersInPeriod = orders.filter(item => {
    if (!item.order?.orderDate) return false;
    const od = new Date(item.order.orderDate);
    if (salesView === "weekly") {
      return od >= startOfWeek;
    }
    if (salesView === "monthly") {
      return od >= startOfMonth;
    }
    return false;
  });

  const periodSalesAmount = ordersInPeriod.reduce((acc, item) => {
    if (!item.order) return acc;
    return acc + item.order.totalPrice;
  }, 0);

  // Calculate chart data for last 7 days
  const getLastNDays = (n: number) => {
    const arr: string[] = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      arr.push(`${d.getMonth() + 1}/${d.getDate()}`);
    }
    return arr;
  };
  const past7 = getLastNDays(7);

  const salesPerDay = past7.map(label => {
    let sum = 0;
    orders.forEach(item => {
      if (!item.order?.orderDate) return;
      const d = new Date(item.order.orderDate);
      const l = `${d.getMonth() + 1}/${d.getDate()}`;
      if (l === label) sum += item.order.totalPrice;
    });
    return sum;
  });


  return (
    <>
      <Navbar />
      <div className="pt-8 flex min-h-screen bg-gradient-to-r from-blue-50/70 via-white to-blue-100">
        <Sidebar
          role="seller"
        />

        <main className="flex-1 ml-64 px-7 py-12">
          {/* --- Dashboard redesigned --- */}
          {partToDisplay === "Dashboard" && (
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <h1 className="text-4xl font-black text-blue-900 tracking-tight flex items-center gap-3">
                  <AiOutlineUsergroupAdd className="inline mb-1" size={34} /> Welcome
                  <span className="ml-2 text-gray-700 font-semibold text-2xl">
                    {products.length > 0 ? products[0].seller.name : "Seller"}
                  </span>!
                </h1>
                <div className="flex gap-2">
                  <button
                    className={`rounded-full px-5 py-2 font-bold shadow 
                                ${salesView === "weekly" ? "bg-blue-800 text-white" : "bg-white text-blue-800 border border-blue-800"}
                               hover:bg-blue-900 hover:text-white transition`}
                    onClick={() => setSalesView("weekly")}
                  >
                    Weekly
                  </button>
                  <button
                    className={`rounded-full px-5 py-2 font-bold shadow 
                                ${salesView === "monthly" ? "bg-blue-800 text-white" : "bg-white text-blue-800 border border-blue-800"}
                                 hover:bg-blue-900 hover:text-white transition`}
                    onClick={() => setSalesView("monthly")}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              <section className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
                <div className="bg-gradient-to-br from-blue-700 via-blue-500/80 to-blue-400 p-6 rounded-xl shadow text-white text-center flex flex-col items-center">
                  <AiOutlineShoppingCart size={40} className="mb-2" />
                  <span className="text-lg">Total Products</span>
                  <span className="text-3xl font-bold">{products.length}</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow text-center border flex flex-col items-center">
                  <AiOutlineCalendar size={36} className="mb-2 text-blue-700" />
                  <span className="text-lg text-gray-700">Pending Orders</span>
                  <span className="text-3xl font-extrabold text-blue-900">
                    {
                      new Set(
                        orders.filter(item => item.order?.orderStatus === "PENDING").map(item => item.order.id)
                      ).size
                    }
                  </span>
                </div>
                <div className="bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-100 p-6 rounded-xl shadow text-center flex flex-col items-center border">
                  <AiOutlineBarChart size={38} className="mb-2 text-yellow-900" />
                  <span className="text-lg text-yellow-900">This {salesView === "weekly" ? "Week" : "Month"}'s Sales</span>
                  <span className="text-3xl font-bold text-yellow-900">D{periodSalesAmount.toLocaleString()}</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow text-center border flex flex-col items-center gap-1">
                  <AiOutlineTag size={38} className="mb-2 text-blue-900" />
                  <span className="text-lg text-blue-800">Bulk Discount Products</span>
                  <span className="text-3xl font-bold text-blue-900">
                    {
                      Object.keys(bulkDiscounts).length
                    }
                  </span>
                </div>
              </section>

              {/* Sales metrics chart */}
              <section className="bg-white rounded-xl shadow mb-12 px-0 py-8 flex flex-col items-stretch">
                <h2 className="text-xl font-bold text-blue-800 text-center -mt-3 mb-5">Your Daily Sales This Week</h2>
                <div className="w-full px-2">
                  <div className="relative h-36 flex items-end gap-2 justify-between">
                    {salesPerDay.map((amt, i) => (
                      <div
                        key={past7[i]}
                        className="flex flex-col-reverse justify-end items-center w-10 min-w-fit"
                        title={`D${amt}`}
                      >
                        <div
                          className="rounded-t-md bg-blue-400 transition"
                          style={{
                            height: `${(amt / Math.max(...salesPerDay, 1)) * 84}px`,
                            minHeight: 6,
                            width: 22,
                          }}
                        />
                        <span className="mt-2 text-xs text-blue-900">{past7[i]}</span>
                        <span className="text-xs text-gray-700 font-medium">D{amt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}

          {/* --- Product Table With Bulk Sales Management --- */}
          {partToDisplay === "Products" && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-blue-900">My Products</h2>
                <button
                  onClick={() => navigate("/add-product")}
                  className="bg-blue-700 hover:bg-blue-900 text-white px-5 py-2 rounded-lg font-bold shadow"
                >
                  + Add Product
                </button>
              </div>
              <div className="bg-white shadow rounded-xl overflow-x-auto mb-6 border">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-100 via-white to-gray-100 uppercase text-xs text-gray-700">
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">In Stock</th>
                      <th className="py-3 px-4">Bulk Sales</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...products].sort((a, b) => b.id - a.id).slice(firstIndex, lastIndex).map((product) => (
                      <tr key={product.id} className="border-b transition hover:bg-blue-50">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-12 w-12 object-cover rounded-lg border"
                          />
                          <span className="font-semibold">{product.name}</span>
                        </td>
                        <td className="py-3 px-4 font-bold text-blue-900">
                          D{product.pricePerUnit.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">{product.stockQuantity}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1">
                            {(bulkDiscounts[product.id] ?? []).map((bulk, idx) => (
                              <div key={idx} className="bg-yellow-100 px-2 py-1 rounded text-xs text-yellow-900 mb-1 flex items-center gap-1">
                                {bulk.discountPercent}% off &ge; {bulk.minQuantity}
                              </div>
                            ))}
                            <button
                              className="mt-1 px-3 py-1 text-sm bg-yellow-400 hover:bg-yellow-500 font-bold rounded shadow"
                              onClick={() => openBulkConfig(product.id)}
                            >
                              Configure Bulk
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 space-x-2">
                          <button onClick={() => handleEdit(product)} className="text-blue-700 hover:text-blue-600 cursor-pointer"><FiEdit size={20}/></button>
                          <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-600 cursor-pointer"><FiTrash2 size={20}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage-1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 border rounded 
                    ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-100"}
                  `}
                  >
                  Prev
                </button>
                {pageNumbers.map((page) => (
                  <button key={page}
                          onClick={() => setCurrentPage(page)} 
                          className={`px-3 py-1 border rounded
                            ${currentPage === page 
                              ? "bg-blue-900 text-white" 
                              : "hover:bg-blue-100"
                            }
                          `}>
                            {page}
                            </button>
                ))}
                <button
                  onClick={() => setCurrentPage(currentPage+1)}
                  disabled={currentPage === numOfPages}
                  className={`px-3 py-1 border rounded 
                    ${currentPage === numOfPages ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-100"}
                  `}>
                  Next
                </button>
              </div>

              {/* Bulk config modal */}
              {showBulkModal && bulkConfigProductId !== null && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-30">
                  <div className="bg-white rounded-xl shadow-2xl p-8 w-[90vw] max-w-lg space-y-6 relative border-2 border-blue-600">
                    <h3 className="text-xl font-bold mb-2 text-blue-700">Set Bulk Discount</h3>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-2 font-medium text-gray-700">
                        Min Quantity: 
                        <input
                          type="number"
                          min={2}
                          value={newBulkDiscount.minQuantity}
                          onChange={e => handleBulkDiscountChange("minQuantity", Math.max(2, +e.target.value))}
                          className="border px-3 py-2 rounded w-24"
                        />
                      </label>
                      <label className="flex items-center gap-2 font-medium text-gray-700">
                        Discount (%): 
                        <input
                          type="number"
                          min={1}
                          max={90}
                          value={newBulkDiscount.discountPercent}
                          onChange={e => handleBulkDiscountChange("discountPercent", Math.max(1, Math.min(90, +e.target.value)))}
                          className="border px-3 py-2 rounded w-24"
                        />
                      </label>
                      <button
                        onClick={saveBulkDiscount}
                        className="bg-blue-700 hover:bg-blue-800 text-white font-bold rounded px-5 py-2.5 mt-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={closeBulkConfig}
                        className="text-red-600 underline font-bold mt-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* --- Orders Table --- */}
          {partToDisplay === "Orders" && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-blue-900">Your Orders</h2>
                {/* Future actions: Export, Filter etc. */}
              </div>
              <div className="bg-white shadow rounded-xl overflow-hidden mb-6 border">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-100 via-white to-gray-100 uppercase text-xs text-gray-700">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Spend</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...uniqueOrders].sort((a, b) => b.id - a.id)
                      .slice(firstIndex, lastIndex)
                      .map((order) => (
                        <tr 
                          key={order.id} 
                          className="border-b transition hover:bg-blue-50"
                        >
                          <td className="py-3 px-4 font-bold text-blue-900">
                            #{order.id}
                          </td>
                          <td className="py-3 px-4">
                            D{order.totalPrice.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`py-1 px-3 rounded-full font-semibold text-xs
                                ${order.orderStatus === "PENDING"
                                  ? "bg-yellow-100 text-yellow-900"
                                  : order.orderStatus === "COMPLETED"
                                    ? "bg-green-100 text-green-900"
                                    : "bg-gray-100 text-gray-700"}
                              `}
                            >
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{formatDate(order.orderDate)}</td>
                          <td className="py-3 px-4 space-x-2">
                            <button
                              title="See Details"
                              className="text-blue-700 hover:text-blue-600 cursor-pointer">
                                <FiEdit size={20}/>
                            </button>
                            <button
                              title="Delete"
                              className="text-red-600 hover:text-red-800 cursor-pointer">
                                <FiTrash2 size={20}/>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 border rounded 
                    ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-100"}
                  `}
                >
                  Prev
                </button>
                {pageNumbers.map((page) => (
                  <button key={page}
                          onClick={() => setCurrentPage(page)} 
                          className={`px-3 py-1 border rounded
                            ${currentPage === page 
                              ? "bg-blue-900 text-white" 
                              : "hover:bg-blue-100"
                            }
                          `}>
                            {page}
                            </button>
                ))}
                <button
                  onClick={() => setCurrentPage(currentPage+1)}
                  disabled={currentPage === numOfPages}
                  className={`px-3 py-1 border rounded 
                    ${currentPage === numOfPages ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-100"}
                  `}>
                  Next
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}