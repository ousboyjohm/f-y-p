import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

const users = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "Customer", status: "Active" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Seller", status: "Inactive" },
];

const products = [
  { id: "1", name: "Sea Bass", seller: "Jane Smith", status: "Active" },
  { id: "2", name: "Tilapia", seller: "John Doe", status: "Active" },
];

export default function AdminDashboard() {
  const totalUsers = users.length;
  const totalSellers = users.filter(u => u.role === "Seller").length;
  const totalProducts = products.length;
  const totalOrders = 15; // example

  return (
    <>
      <Navbar />
      <div className="pt-24 flex">
        {/* Sidebar */}
        <Sidebar role="admin"/>

        {/* Main Content */}
        <main className="flex-1 ml-64 px-6 py-12">
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
              <p className="text-2xl font-bold text-blue-900">D{totalOrders}</p>
            </div>
          </div>

          {/* Users Table */}
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
                {users.map(user => (
                  <tr key={user.id} className="border-b">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.role}</td>
                    <td className="py-3 px-4">{user.status}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button className="text-blue-700 hover:underline">Edit</button>
                      <button className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Products Table */}
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
                {products.map(product => (
                  <tr key={product.id} className="border-b">
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4">{product.seller}</td>
                    <td className="py-3 px-4">{product.status}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button className="text-blue-700 hover:underline">Edit</button>
                      <button className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}