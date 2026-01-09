import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import axios from "axios";
import type { Product } from "../models/modelTypes";


export default function Shop() {

  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPerPage, setTotalPerPage] = useState(8);
  const firstIndex = (currentPage -1) * totalPerPage;
  const lastIndex = firstIndex + totalPerPage;
  const numOfPages = Math.ceil(products.length / totalPerPage);
  const pageNumbers = Array.from({ length: numOfPages }, (_, i) => i + 1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
      const fetchFeaturedProducts = async () => {
        try {
          const response = await axios.get("http://localhost:8080/products");
          setProducts(response.data);
        } catch (err) {
          setError("Failed to load featured products");
        } finally {
          setLoading(false);
        }
      };
  
      fetchFeaturedProducts();
    }, []);


  const fetchProducts = async (filters: { categories: string[], sort: string }) => {
   const query = new URLSearchParams();

   if (filters.categories.length > 0)
      query.append("category", filters.categories.join(","));

   if (filters.sort !== "default")
      query.append("sort", filters.sort);

   const res = await axios.get(`http://localhost:8080/products?${query.toString()}`);
   setProducts(res.data);
};


  return (
    <>
      <Navbar />
      <div className="pt-10 flex">

        {/* <Sidebar role="shop" onFilterChange={(filters) => {
          fetchProducts(filters);
        }}/> */}

        <main className="flex-1  px-6 py-12"> {/*ml-64*/}
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Shop</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(firstIndex, lastIndex).map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.pricePerUnit}
                image={product.imageUrl}
              />
            ))}
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
        </main>
      </div>
    </>
  );
}
