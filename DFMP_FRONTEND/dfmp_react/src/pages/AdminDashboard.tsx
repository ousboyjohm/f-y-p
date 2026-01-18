import Navbar from "../components/Navbar";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Order, OrderItem, Product, User } from "../models/modelTypes";

export default function AdminDashboard() {

  const [partToDisplay, setpartToDisplay] = useState("Dashboard");
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  // const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [totalSellers, setTotalSellers] = useState(0); 
  const totalUsers = users.length;
  const totalProducts = products.length;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPerPage= 7;
  const firstIndex = (currentPage -1) * totalPerPage;
  const lastIndex = firstIndex + totalPerPage;
  const numOfPages = Math.ceil(products.length / totalPerPage);
  const pageNumbers = Array.from({ length: numOfPages }, (_, i) => i + 1);

  const API_URL = import.meta.env.VITE_API_URL;
  
    useEffect(() => {
      if (location.state?.section) {
        setpartToDisplay(location.state.section);
      }
      const fetchData = async () => {
        try {
          const [productsRes, usersRes, ordersRes, orderItemsRes] =
            await Promise.all([
              axios.get(`${API_URL}/products`),
              axios.get(`${API_URL}/users`),
              axios.get(`${API_URL}/order`),
              axios.get(`${API_URL}/order-items`)
            ]);

          setProducts(productsRes.data);
          setUsers(usersRes.data);

          const orders: Order[] = ordersRes.data;
          const orderItems: OrderItem[] = orderItemsRes.data;

          const orderMap = new Map<number, Order>();

          orders.forEach(order => {
            orderMap.set(order.id, {
              ...order,
              items: []
            });
          });

          orderItems.forEach(item => {
            const orderId = item.order?.id;
            const parent = orderMap.get(orderId);
            if (parent) {
              parent.items.push(item);
            }
          });

          setOrders(Array.from(orderMap.values()));

          const users: User[] = usersRes.data;
          setTotalSellers(users.filter(u => u.role === "SELLER").length);

        } catch (err) {
          console.error("Failed!", err);
        }
      };

  fetchData();
}, [location.state]);


      const handleDelete = async (id: number) => {
          try {
            await axios.delete(`${API_URL}/products/${id}`); 
            setProducts((prev) => prev.filter((product) => product.id !== id));

            await axios.delete(`${API_URL}/users/${id}`); 
            setUsers((prev) => prev.filter((user) => user.id !== id));
          } catch (err) {
            console.error("Failed to remove item:", err);
          }
        };

  return (
    <>
      <Navbar />
      <div className="pt-8 flex">
        {/* Sidebar */}
        <Sidebar role="admin"/>

        {/* Main Content */}
        <main className="flex-1 ml-64 px-6 py-12">
          {partToDisplay === "Dashboard" && (
            <>
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

          {/* Site Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600">Total Sellers</p>
              <p className="text-2xl font-bold text-gray-800">{totalSellers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-800">{totalProducts}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-blue-900">D{orders.length}</p>
            </div>
          </div>
          </>
          )}

          {/* Users Table */}
          {partToDisplay === "Users" && (
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <h2 className="text-xl font-semibold p-4 border-b">User List</h2>
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...users]
                .filter(user => user.role != "ADMIN")
                .sort((a, b) => b.id - a.id)
                .slice(firstIndex, lastIndex)
                .map(user => (
                  <tr key={user.id} className="border-b">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.username}</td>
                    <td className="py-3 px-4">{user.role}</td>
                    {/* <td className="py-3 px-4">{user.status}</td> */}<td>Active</td>
                    <td className="py-3 px-4 space-x-2">
                      <button className="text-blue-700 hover:underline"><FiEdit size={20}/></button>
                      <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:underline"><FiTrash2 size={20}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}

          {/* Products Table */}
          {partToDisplay === "Products" && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <h2 className="text-xl font-semibold p-4 border-b">Product List</h2>
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Seller</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...products]
                .sort((a, b) => b.id - a.id)
                .slice(firstIndex, lastIndex)
                .map(product => (
                  <tr key={product.id} className="border-b">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                       src={product.imageUrl}
                        alt={product.name}
                         className="h-10 w-13 object-cover rounded"
                       />
                      {product.name}</td>
                    <td className="py-3 px-4">{product.seller.name}</td>
                    {/* <td className="py-3 px-4">{product.status}</td> */}<td>Active</td>
                    <td className="py-3 px-4 space-x-2">
                      <button className="text-blue-700 hover:underline"><FiEdit size={20}/></button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline"><FiTrash2 size={20}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}

          {partToDisplay === "Orders" && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <h2 className="text-xl font-semibold p-4 border-b">Orders</h2>
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Action</th>

                </tr>
              </thead>
              <tbody>
                {[...orders]
                .sort((a, b) => b.id - a.id)
                .slice(firstIndex, lastIndex)
                .map(order => (
                  <tr key={order.id} className="border-b">
                    <td className="py-3 px-4 flex items-center gap-3">
                      {order.id}</td>
                    <td className="py-3 px-4">{order.customer.name}</td>
                    <td className="py-3 px-4">{order.orderStatus}</td>
                    <td className="py-3 px-4">{order.items.length}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button className="text-blue-700 hover:underline"><FiEdit size={20}/></button>
                      <button onClick={() => handleDelete(order.id)} className="text-red-600 hover:underline"><FiTrash2 size={20}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}

 

          {partToDisplay !== "Dashboard" && (
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
      `}>Next</button>
          </div>
          )}
        </main>
      </div>
    </>
  );
}