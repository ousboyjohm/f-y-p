import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import type { Product } from "../models/modelTypes";
import axios from "axios";
// import { MdLogin, MdLogout, MdEdit, MdDelete, MdPerson, MdAdd, MdAddCircle, MdAddAPhoto } from "react-icons/md";
import { FiEdit, FiTrash2 } from "react-icons/fi";
// import { FaEdit, FaTrash, FaUser, FaPlus, FaPlusSquare } from "react-icons/fa";


// const products = [
//   { id: "1", name: "Sea Bass", price: 120, stock: 20 },
//   { id: "2", name: "Tilapia", price: 250, stock: 15 },
//   { id: "3", name: "Crab Deluxe", price: 600, stock: 10 },
// ];

export default function SellerDashboard() {

  const pendingOrders = 5; 
  const monthlySales = 12000; 
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPerPage= 7;
  const firstIndex = (currentPage -1) * totalPerPage;
  const lastIndex = firstIndex + totalPerPage;
  const numOfPages = Math.ceil(products.length / totalPerPage);
  const pageNumbers = Array.from({ length: numOfPages }, (_, i) => i + 1);
  

  useEffect(() => {
          const seller = sessionStorage.getItem("userId");
          const fetchProducts = async () => {
          try {
              const API_URL = import.meta.env.VITE_API_URL;
              const response = await axios.post(`${API_URL}/products/seller`, { id: Number(seller)});
              setProducts(response.data);
          } catch (err) {
              // setError("Failed to load featured products");
          } finally {
              // setLoading(false);
          }
      };  
          fetchProducts();
    }, []);
  

  return (
    <>
      <Navbar />
      <div className="pt-8 flex">
        {/* Sidebar */}
        <Sidebar role="seller"/>

        {/* Main Content */}
        <main className="flex-1 ml-64 px-6 py-12">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome {products.length > 0 && products[0].seller.name}!</h1>

          {/* Sales Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-800">{products.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-800">{pendingOrders}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600">Monthly Sales</p>
              <p className="text-2xl font-bold text-blue-900">D{monthlySales}</p>
            </div>
          </div>

          {/* Product Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock Quantity</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(firstIndex, lastIndex).map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4">D{product.pricePerUnit}</td>
                    <td className="py-3 px-4">{product.stockQuantity}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button className="text-blue-700 hover:text-blue-400 cursor-pointer"><FiEdit size={20}/></button>
                      <button className="text-red-600 hover:text-red-300 cursor-pointer"><FiTrash2 size={20}/></button>
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
      `}>Next</button>
          </div>

          {/* Add Product Button */}
          {/* <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded">
            Add New Product
          </button> */}
        </main>
      </div>
      <Footer />
    </>
  );
}