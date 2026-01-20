import Navbar from "../components/Navbar";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { Order, OrderItem, Product, User } from "../models/modelTypes";

type ModalType =
  | null
  | { type: "user" | "product" | "order"; data: any }
  | { type: "add-user" }
  | { type: "add-product" };

const PAGE_SIZE = 7;

const CATEGORY_OPTIONS = [
  { id: 1, label: "Fish" },
  { id: 2, label: "Prawns" },
  { id: 3, label: "Crabs" },
  { id: 4, label: "Lobsters" },
];

export default function AdminDashboard() {
  const [partToDisplay, setPartToDisplay] = useState<
    "Dashboard" | "Users" | "Products" | "Orders"
  >("Dashboard");
  const location = useLocation();
  // const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalSellers, setTotalSellers] = useState(0);

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);

  // Pagination state for each section individually
  const [currentPage, setCurrentPage] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all required dashboard data
  useEffect(() => {
    if (location.state?.section) {
      setPartToDisplay(location.state.section);
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, usersRes, ordersRes, orderItemsRes] = await Promise.all([
          axios.get(`${API_URL}/products`),
          axios.get(`${API_URL}/users`),
          axios.get(`${API_URL}/order`),
          axios.get(`${API_URL}/order-items`)
        ]);
        setProducts(productsRes.data);
        setUsers(usersRes.data);

        const orders: Order[] = ordersRes.data;
        const orderItems: OrderItem[] = orderItemsRes.data;

        // Map Order Items into orders
        const orderMap = new Map<number, Order>();
        orders.forEach(order => {
          orderMap.set(order.id, { ...order, items: [] });
        });
        orderItems.forEach(item => {
          const orderId = item.order?.id;
          const parent = orderMap.get(orderId);
          if (parent) {
            parent.items.push(item);
          }
        });
        setOrders(Array.from(orderMap.values()));
        setTotalSellers(usersRes.data.filter((u: User) => u.role === "SELLER").length);
      } catch (error) {
        console.error("Failed to fetch data!", error);
      }
      setLoading(false);
    };
    fetchData();
    setCurrentPage(1); // Reset page on location/section change
  }, [location.state]);


  useEffect(() => {
    setCurrentPage(1);
  }, [partToDisplay]);

  const getPageData = <T,>(data: T[]) => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return data.slice(start, end);
  };

  const getPageNumbers = (dataLength: number) => {
    return Array.from({ length: Math.ceil(dataLength / PAGE_SIZE) }, (_, i) => i + 1);
  };


  const handleUserDelete = async (id: number) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      setUsers(users => users.filter(u => u.id !== id));
      // Optionally, remove user's products/orders too.
    } catch (err) {
      alert("Failed to delete user.");
      console.error(err);
    }
  };

  const handleProductDelete = async (id: number) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      setProducts(products => products.filter(p => p.id !== id));
    } catch (err) {
      alert("Failed to delete product.");
      console.error(err);
    }
  };

  // const handleOrderDelete = async (id: number) => {
  //   if (!window.confirm("Delete this order?")) return;
  //   try {
  //     await axios.delete(`${API_URL}/order/${id}`);
  //     setOrders(orders => orders.filter(order => order.id !== id));
  //   } catch (err) {
  //     alert("Failed to delete order.");
  //     console.error(err);
  //   }
  // };


  const handleUserStatusToggle = async (user: User, active: boolean) => {
    try {
      await axios.put(`${API_URL}/users/${user.id}`, {...user, active: !active });
      setUsers(users =>
        users.map(u => (u.id === user.id ? { ...u, active: !active } : u))
      );
    } catch (error) {
      alert("Failed to change user status.");
    }
  };

  // Product activation/deactivation (toggle active)
  const handleProductStatusToggle = async (product: Product, active: boolean) => {
    try {
      await axios.put(`${API_URL}/products/${product.id}`, {...product, active: !active });
      setProducts(products =>
        products.map(p => (p.id === product.id ? { ...p, active: !active } : p))
      );
    } catch (error) {
      alert("Failed to change product status.");
    }
  };

  // =============== Add Modal & Edit Modal and Handlers ===============
  // Unified Modal for add/edit actions
  function EditModal() {
    if (!modal) return null;

    // Detect add vs. edit mode
    if (modal.type === "add-user") {
      // Add User Modal
      const [form, setForm] = useState({
        name: "",
        username: "",
        password: "",
        address: "",
        phoneNumber:"",
        role: "SELLER",
        active: true,
      });
      const [saving, setSaving] = useState(false);

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
      };

      const handleSave = async () => {
        setSaving(true);
        try {
          if (!form.name || !form.username || !form.password) {
            alert("All fields are required");
            setSaving(false);
            return;
          }
          const res = await axios.post(`${API_URL}/signup`, form);
          setUsers(u => [res.data, ...u]);
          setModal(null);
        } catch (e) {
          alert("Adding user failed. Please try again.");
          console.error(e);
        }
        setSaving(false);
      };

      return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded shadow-lg min-w-[320px] max-w-sm">
            <h2 className="text-xl mb-3">Add User</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSave();
              }}
              className="flex flex-col gap-4"
            >
              <input
                className="border rounded px-2 py-1"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Name"
                required
              />
              <input
                className="border rounded px-2 py-1"
                name="username"
                value={form.username}
                onChange={handleInputChange}
                placeholder="Email"
                type="text"
                required
              />
              <input
                className="border rounded px-2 py-1"
                name="address"
                value={form.address}
                onChange={handleInputChange}
                placeholder="Address"
                type="text"
                required
              />
              <input
                className="border rounded px-2 py-1"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleInputChange}
                placeholder="phone"
                type="text"
                required
              />
              <input
                className="border rounded px-2 py-1"
                name="password"
                value={form.password}
                onChange={handleInputChange}
                placeholder="Password"
                type="password"
                required
              />
              <select
                className="border rounded px-2 py-1"
                name="role"
                value={form.role}
                onChange={handleInputChange}
              >
                <option value="CUSTOMER">Buyer</option>
                <option value="SELLER">Seller</option>
              </select>
              <div className="flex gap-2 mt-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1 bg-blue-900 text-white rounded hover:bg-blue-800"
                >
                  {saving ? "Saving..." : "Add"}
                </button>
                <button
                  type="button"
                  className="px-4 py-1 bg-gray-200 rounded"
                  onClick={() => setModal(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    if (modal.type === "add-product") {
      // Add Product Modal
      const [form, setForm] = useState({
        name: "",
        description:"",
        pricePerUnit: "",
        stockQuantity: "",
        imageUrl: "",
        category: { id: CATEGORY_OPTIONS[0].id },
        seller: { id: users[0].id },
        active: true,
      });
      const [saving, setSaving] = useState(false);

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target as HTMLInputElement;
        if (name === "category") {
          setForm((prev) => ({
            ...prev,
            category: { id: Number(value) },
          }));
          return;
        }
        if (name === "seller") {
        setForm(prev => ({
          ...prev,
          seller: { id: Number(value) },
        }));
        return;
      }
        setForm(prev => ({ ...prev, [name]: value }));
      };

      const handleSave = async () => {
        setSaving(true);
        try {
          if (!form.name || !form.imageUrl || !form.seller) {
            alert("All fields are required");
            setSaving(false);
            return;
          }
          const res = await axios.post(`${API_URL}/products`, {
            ...form,
            seller: {id: Number(form.seller.id)},
          });
           const createdProduct = res.data;
          const fullSeller = users.find(u => u.id === form.seller.id);

          setProducts(p => [
            {
              ...createdProduct,
              seller: fullSeller ?? null, // ✅ FIX #2
            },
            ...p,
          ]);
          setModal(null);
        } catch (e) {
          alert("Adding product failed. Please try again.");
          console.error(e);
        }
        setSaving(false);
      };

      // Find sellers to select
      const availableSellers = users.filter(u => u.role === "SELLER");

      return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded shadow-lg min-w-[320px] max-w-sm">
            <h2 className="text-xl mb-3">Add Product</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSave();
              }}
              className="flex flex-col gap-4"
            >
              <input
                className="border rounded px-2 py-1"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Product Name"
                required
              />
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Description"
                  value={form.description}
                  onChange={handleInputChange}
                  className="border rounded px-2 py-1"
                  required
                />
                  <input
                    id="pricePerUnit"
                    type="number"
                    name="pricePerUnit"
                    min={0}
                    value={form.pricePerUnit}
                    onChange={handleInputChange}
                    className="border rounded px-2 py-1"
                    required
                  />

                  <input
                    id="stockQuantity"
                    type="number"
                    name="stockQuantity"
                    min={0}
                    value={form.stockQuantity}
                    onChange={handleInputChange}
                    className="border-2 border-blue-200 rounded-lg w-full px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:bg-blue-50 transition-all duration-150"
                    required
                  />
              <input
                className="border rounded px-2 py-1"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleInputChange}
                placeholder="Image URL"
                required
              />
              <select
                    id="category"
                    name="category"
                    value={form.category.id}
                    onChange={handleInputChange}
                    className="border rounded px-2 py-1"
                    required
                  >
                    <option value="">Choose Category</option>
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
              <select
                id="seller"
                className="border rounded px-2 py-1"
                name="seller"
                value={form.seller.id}
                onChange={handleInputChange}
                required
              >
                <option value="">Choose Seller</option>
                {availableSellers.map(seller => (
                  <option key={seller.id} value={seller.id}>
                    {seller.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2 mt-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1 bg-blue-900 text-white rounded hover:bg-blue-800"
                >
                  {saving ? "Saving..." : "Add"}
                </button>
                <button
                  type="button"
                  className="px-4 py-1 bg-gray-200 rounded"
                  onClick={() => setModal(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    // ==== Default: Edit Modals for existing objects! ====
    const { type, data } = modal;
    const [form, setForm] = useState<any>(data);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm({ ...form, [name]: value });
    };

    const handleSave = async () => {
      try {
        if (type === "user") {
          await axios.put(`${API_URL}/users/${form.id}`, { ...form });
          setUsers(users =>
            users.map(u => (u.id === form.id ? { ...u, ...form } : u))
          );
        }
        if (type === "product") {
          await axios.put(`${API_URL}/products/${form.id}`, { ...form });
          setProducts(products =>
            products.map(p => (p.id === form.id ? { ...p, ...form } : p))
          );
        }
        if (type === "order") {
          await axios.put(`${API_URL}/order/${form.id}`, { orderStatus: form.orderStatus, ...form });
          setOrders(orders =>
            orders.map(o =>
              o.id === form.id ? { ...o, orderStatus: form.orderStatus } : o
            )
          );
        }
        setModal(null);
      } catch (e) {
        alert("Update failed. Please try again.");
        console.error(e);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
        <div className="bg-white p-6 rounded shadow-lg min-w-[320px] max-w-sm">
          <h2 className="text-xl mb-3">
            Edit {type[0].toUpperCase() + type.slice(1)}
          </h2>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSave();
            }}
            className="flex flex-col gap-4"
          >
            {type === "user" && (
              <>
                <input
                  className="border rounded px-2 py-1"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  required
                />
                <input
                  className="border rounded px-2 py-1"
                  name="username"
                  value={form.username}
                  onChange={handleInputChange}
                  placeholder="Email"
                  required
                />
                <select
                  className="border rounded px-2 py-1"
                  name="role"
                  value={form.role}
                  onChange={handleInputChange}
                >
                  <option value="BUYER">Buyer</option>
                  <option value="SELLER">Seller</option>
                </select>
              </>
            )}
            {type === "product" && (
              <>
                <input
                  className="border rounded px-2 py-1"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Product Name"
                  required
                />
                <input
                  className="border rounded px-2 py-1"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleInputChange}
                  placeholder="Image URL"
                  required
                />
                {/* For simplicity, not allowing to change seller */}
              </>
            )}
            {type === "order" && (
              <>
                <input
                  className="border rounded px-2 py-1"
                  name="id"
                  value={form.id}
                  onChange={handleInputChange}
                  disabled
                />
                <select
                  name="orderStatus"
                  className="border rounded px-2 py-1"
                  value={form.orderStatus}
                  onChange={handleInputChange}
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </>
            )}
            <div className="flex gap-2 mt-3">
              <button
                type="submit"
                className="px-4 py-1 bg-blue-900 text-white rounded hover:bg-blue-800"
              >
                Save
              </button>
              <button
                type="button"
                className="px-4 py-1 bg-gray-200 rounded"
                onClick={() => setModal(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Table with optional actions for admin management
  const renderUsersTable = () => {
    const filtered = users
      .filter(u => u.role !== "ADMIN")
      .sort((a, b) => b.id - a.id);

    return (
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="flex justify-between px-4 pt-4 pb-2 border-b items-center">
          <h2 className="text-xl font-semibold">User List</h2>
          <button
            className="flex items-center gap-1 px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-900 text-sm"
            onClick={() => setModal({ type: "add-user" })}
            title="Add User"
          >
            <FiPlus /> Add User
          </button>
        </div>
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
            {getPageData(filtered).map(user => (
              <tr key={user.id} className="border-b">
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.username}</td>
                <td className="py-3 px-4">{user.role}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs ${
                      user.active !== false
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {user.active !== false ? "Active" : "Inactive"}
                  </span>
                  <button
                    className={`ml-2 text-xs underline text-blue-800`}
                    onClick={() => handleUserStatusToggle(user, user.active !== false)}
                  >
                    {user.active !== false ? "Deactivate" : "Activate"}
                  </button>
                </td>
                <td className="py-3 px-4 space-x-2">
                  <button
                    className="text-blue-700 hover:underline"
                    title="Edit"
                    onClick={() => setModal({ type: "user", data: user })}
                  >
                    <FiEdit size={20} />
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    title="Delete"
                    onClick={() => handleUserDelete(user.id)}
                  >
                    <FiTrash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderProductsTable = () => {
    const sorted = [...products].sort((a, b) => b.id - a.id);

    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="flex justify-between px-4 pt-4 pb-2 border-b items-center">
          <h2 className="text-xl font-semibold">Product List</h2>
          <button
            className="flex items-center gap-1 px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-900 text-sm"
            onClick={() => setModal({ type: "add-product" })}
            title="Add Product"
          >
            <FiPlus /> Add Product
          </button>
        </div>
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
            {getPageData(sorted).map(product => (
              <tr key={product.id} className="border-b">
                <td className="py-3 px-4 flex items-center gap-3">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-10 w-13 object-cover rounded"
                  />
                  {product.name}
                </td>
                <td className="py-3 px-4">{product.seller?.name}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs ${
                      product.active !== false
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {product.active !== false ? "Active" : "Inactive"}
                  </span>
                  <button
                    className={`ml-2 text-xs underline text-blue-800`}
                    onClick={() =>
                      handleProductStatusToggle(product, product.active !== false)
                    }
                  >
                    {product.active !== false ? "Deactivate" : "Activate"}
                  </button>
                </td>
                <td className="py-3 px-4 space-x-2">
                  <button
                    className="text-blue-700 hover:underline"
                    title="Edit"
                    onClick={() => setModal({ type: "product", data: product })}
                  >
                    <FiEdit size={20} />
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    title="Delete"
                    onClick={() => handleProductDelete(product.id)}
                  >
                    <FiTrash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderOrdersTable = () => {
    const sorted = [...orders].sort((a, b) => b.id - a.id);
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="flex justify-between px-4 pt-4 pb-2 border-b items-center">
          <h2 className="text-xl font-semibold">Orders</h2>
        </div>
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
            {getPageData(sorted).map(order => (
              <tr key={order.id} className="border-b">
                <td className="py-3 px-4">{order.id}</td>
                <td className="py-3 px-4">{order.customer?.name}</td>
                <td className="py-3 px-4">{order.orderStatus}</td>
                <td className="py-3 px-4">{order.items?.length ?? 0}</td>
                <td className="py-3 px-4 space-x-2">
                  <button
                    className="text-blue-700 hover:underline"
                    title="Edit"
                    onClick={() => setModal({ type: "order", data: order })}
                  >
                    <FiEdit size={20} />
                  </button>
                  {/* <button
                    className="text-red-600 hover:underline"
                    title="Delete"
                    onClick={() => handleOrderDelete(order.id)}
                  >
                    <FiTrash2 size={20} />
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  //---------------------------------------

  // Table section count for pagination
  const sectionDataCount =
    partToDisplay === "Users"
      ? users.filter(u => u.role !== "ADMIN").length
      : partToDisplay === "Products"
      ? products.length
      : partToDisplay === "Orders"
      ? orders.length
      : 0;

  const pageNumbers = getPageNumbers(sectionDataCount);

  //---------------------------------------

  // ------ InfoCards (Dashboard) and Logs demo ------
  // Optional: Activity logs simulation for demonstration
  const [activityLogs] = useState([
    { msg: "User Alice (ID 2) was promoted to Seller", date: "2024-05-18" },
    { msg: "Order 104 marked as Completed", date: "2024-05-18" },
    { msg: "Product 'Headphones' deleted", date: "2024-05-17" },
    { msg: "User Bob (ID 3) deactivated", date: "2024-05-17" },
    { msg: "New Product 'Tablet' added", date: "2024-05-16" },
  ]);

  // ------ Admin Dashboard Layout ------
  return (
    <>
      <Navbar />
      {modal && <EditModal />}
      <div className="pt-8 flex bg-gray-50 min-h-screen">
        {/* Sidebar */}
        <Sidebar
          role="admin"
          onSectionChange={section => {
            setPartToDisplay(section);
            setCurrentPage(1);
          }}
        />

        {/* Main Content */}
        <main className="flex-1 ml-64 px-6 py-12 relative">
          {loading && (
            <div className="fixed inset-0 bg-white/60 z-30 flex items-center justify-center">
              <div className="text-lg text-blue-900 font-bold">Loading...</div>
            </div>
          )}

          {partToDisplay === "Dashboard" && (
            <>
              <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow text-center">
                  <p className="text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-800">{users.length}</p>
                  <div className="mt-2 text-xs text-blue-700 cursor-pointer hover:underline"
                    onClick={() => setPartToDisplay("Users")}>Manage</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow text-center">
                  <p className="text-gray-600">Total Sellers</p>
                  <p className="text-2xl font-bold text-gray-800">{totalSellers}</p>
                  <div className="mt-2 text-xs text-blue-700 cursor-pointer hover:underline"
                    onClick={() => setPartToDisplay("Users")}>View</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow text-center">
                  <p className="text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-800">{products.length}</p>
                  <div className="mt-2 text-xs text-blue-700 cursor-pointer hover:underline"
                    onClick={() => setPartToDisplay("Products")}>Add/Manage</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow text-center">
                  <p className="text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-900">{orders.length}</p>
                  <div className="mt-2 text-xs text-blue-700 cursor-pointer hover:underline"
                    onClick={() => setPartToDisplay("Orders")}>Review</div>
                </div>
              </div>
              
              <div className="bg-white mt-6 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold text-gray-800">Recent Admin Activities</h2>
                  <span className="text-xs text-gray-400 font-mono">Demo</span>
                </div>
                <ul className="divide-y">
                  {activityLogs.map((log, idx) => (
                    <li key={idx} className="py-2 flex items-center text-sm">
                      <span className="flex-1">{log.msg}</span>
                      <span className="ml-2 text-gray-400">{log.date}</span>
                    </li>
                  ))}
                  {activityLogs.length === 0 && (
                    <li className="py-2 text-gray-400 italic">No recent activities.</li>
                  )}
                </ul>
              </div>
            </>
          )}

          {partToDisplay === "Users" && renderUsersTable()}
          {partToDisplay === "Products" && renderProductsTable()}
          {partToDisplay === "Orders" && renderOrdersTable()}

          {partToDisplay !== "Dashboard" && pageNumbers.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={() => setCurrentPage(x => Math.max(1, x - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded
                  ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-100"}
                `}
              >
                Prev
              </button>
              {pageNumbers.map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded
                    ${currentPage === page
                      ? "bg-blue-900 text-white"
                      : "hover:bg-blue-100"}
                  `}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(x => Math.min(pageNumbers.length, x + 1))}
                disabled={currentPage === pageNumbers.length}
                className={`px-3 py-1 border rounded
                  ${currentPage === pageNumbers.length ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-100"}
                `}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}