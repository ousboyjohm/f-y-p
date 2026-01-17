import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Product, OrderItem, Order } from "../models/modelTypes";
import axios from "axios";
// import { MdLogin, MdLogout, MdEdit, MdDelete, MdPerson, MdAdd, MdAddCircle, MdAddAPhoto } from "react-icons/md";
import { FiEdit, FiTrash2 } from "react-icons/fi";
// import { FaEdit, FaTrash, FaUser, FaPlus, FaPlusSquare } from "react-icons/fa";


export default function SellerDashboard() {

  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");
  const [partToDisplay, setpartToDisplay] = useState("Dashboard");
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPerPage= 7;
  const firstIndex = (currentPage -1) * totalPerPage;
  const lastIndex = firstIndex + totalPerPage;
  const numOfPages = Math.ceil(products.length / totalPerPage);
  const pageNumbers = Array.from({ length: numOfPages }, (_, i) => i + 1);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [uniqueOrders, setUniqueOrders] = useState<Order[]>([]);

  // This is the page that is displayed immediately a seller signs in.
  // Immediately it loads, it fetches a the products of the seller and also the orders the seller has
  //  and stores 
  // them in the products and order states respectfully. It displays the dashboard by default.
  //  It uses the sidebar component 
  // to decide what to display. The side bar component sends it what is to be displayed, and it stores that
  // in the partToDisplay state. Then it displays it on the page.

  useEffect(() => {
          const seller = sessionStorage.getItem("userId");
          if (location.state?.section) {
            setpartToDisplay(location.state.section);
          }
          const fetchProducts = async () => {
          try {
              // const API_URL = import.meta.env.VITE_API_URL;
              const response = await axios.post(`${API_URL}/products/seller`, { id: Number(seller)});
              setProducts(response.data);

                const requests = response.data.map((product: any) =>
                    axios.post(`${API_URL}/order-items/product`, {
                      id: product.id, 
                    })
                );
          
                const results = await Promise.all(requests);
      
                const allOrderItems = results.flatMap(res => res.data);
      
                setOrders(allOrderItems);
                //remove below here, not efficient
                setUniqueOrders(
                  Array.from(
                    new Map<number, Order>(
                      orders.map(item => [item.order.id, item.order])
                    ).values()
                  )
                );
             
          } catch (err) {
              // setError("Failed to load featured products");
          } finally {
              // setLoading(false);
          }
      };  
          fetchProducts();
    }, [location.state, orders]);

      // This is the function that handles the edit of a product. When the edit icon on a product
      // is clicked, it takes you to the AddProduct component and send the product to be deleted there
    function handleEdit(product: Product) {
        navigate(`/add-product/${product.id}`, {state: {product}}); 
      }

      // The function that handles the deletion of a product. When the delete icon is clicked, it deletes the 
      // product and then displays the remaining products
    const handleDelete = async (id: number) => {
        try {
          await axios.delete(`${API_URL}/products/${id}`); 
          setProducts((prev) => prev.filter((product) => product.id !== id));
        } catch (err) {
          console.error("Failed to remove item:", err);
        }
      };
  

  return (
    <>
      <Navbar />
      <div className="pt-8 flex">
        {/* Sidebar */}
        <Sidebar role="seller"/>

        {/* Main Content */}
        <main className="flex-1 ml-64 px-6 py-12">
          {partToDisplay === "Dashboard" && (
          <>
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome {products.length > 0 ? products[0].seller.name : "To The Platform"}!</h1>

          {/* Sales Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-800">{products.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-800">{
                  new Set(
                    orders
                      .filter(item => item.order?.orderStatus =="PENDING")
                      .map(item => item.order.id)
                  ).size}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600">Monthly Sales</p>
              <p className="text-2xl font-bold text-blue-900">D{
                Array.from(
                  new Set(
                    orders
                      .filter(item =>
                        item.order &&
                        new Date(item.order.orderDate).getMonth() === new Date().getMonth()
                      )
                      .map(item => item.order)
                  )
                ).reduce((sum, order) => sum + order.totalPrice, 0)}
              </p>
            </div>
          </div>
          </>
          )}

          {/* Product Table */}
          {partToDisplay === "Products" && (
          <>
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
                {[...products]
                .sort((a, b) => b.id - a.id)
                .slice(firstIndex, lastIndex)
                .map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                       src={product.imageUrl}
                        alt={product.name}
                         className="h-10 w-13 object-cover rounded"
                       />
                      {product.name}
                      </td>
                    <td className="py-3 px-4">D{product.pricePerUnit}</td>
                    <td className="py-3 px-4">{product.stockQuantity}</td>
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
      `}>Next</button>
          </div>
         </>
          )}

          {partToDisplay === "Orders" && (
          <>
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Spend</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...uniqueOrders]
                .sort((a, b) => b.id - a.id)
                .slice(firstIndex, lastIndex)
                .map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="py-3 px-4 flex items-center gap-3">
                      {/* <img
                       src={order.imageUrl}
                        alt={order.name}
                         className="h-10 w-13 object-cover rounded"
                       /> */}
                      {order.id}
                      </td>
                    <td className="py-3 px-4">D{order.totalPrice}</td>
                    <td className="py-3 px-4">{order.orderStatus}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button onClick={() => console.log("Edit")} className="text-blue-700 hover:text-blue-600 cursor-pointer"><FiEdit size={20}/></button>
                      <button onClick={() => console.log("Delete")} className="text-red-600 hover:text-red-600 cursor-pointer"><FiTrash2 size={20}/></button>
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
         </>
          )}
        </main>
      </div>
    </>
  );
}