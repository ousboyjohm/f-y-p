import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import type { Product } from "../models/modelTypes";
import Sidebar from "../components/Sidebar";

/**
 * Shop: Matches LandingPage style with sidebar filter/sort logic
 * Filters and sorting are applied client-side (since backend does not currently support query params).
 */
export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // These keep track of filter and sort selected in sidebar
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("default");

  const totalPerPage = 8;
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch ALL products from backend one time on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const resp = await axios.get(`${API_URL}/products`);
        setProducts(resp.data);
      } catch (err) {}
    };
    fetchAll();
  }, [API_URL]);

  // When products/filter/sort change, update current page of products
  useEffect(() => {
    let arr = [...products];
    // Filter by category (sidebar sends only the user-checked ones)
    if (selectedCategories.length !== 0) {
      arr = arr.filter(
        (p) => p.category && selectedCategories.includes(p.category.name)
      );
    }
    // Sort option
    if (sortOption === "price-asc") {
      arr.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
    } else if (sortOption === "price-desc") {
      arr.sort((a, b) => b.pricePerUnit - a.pricePerUnit);
    }
    setFiltered(arr);
    setCurrentPage(1); // Whenever filter/sort changes, reset to pg1
  }, [products, selectedCategories, sortOption]);

  // Pagination vars (filtered is always the array being paginated)
  const firstIndex = (currentPage - 1) * totalPerPage;
  const lastIndex = firstIndex + totalPerPage;
  const pageProducts = filtered.slice(firstIndex, lastIndex);
  const numOfPages = Math.max(1, Math.ceil(filtered.length / totalPerPage));
  const pageNumbers = Array.from({ length: numOfPages }, (_, i) => i + 1);

  // Callback for the sidebar to tell us what the user selected
  const handleSidebarFilter = useCallback(
    (filters: { categories: string[]; sort: string }) => {
      setSelectedCategories(filters.categories);
      setSortOption(filters.sort);
    },
    []
  );

  return (
    <>
      <Navbar />
      <main className="pt-24 bg-gradient-to-b from-blue-50 via-white to-blue-100 min-h-screen">
        <div className="max-w-7xl mx-auto flex px-2 sm:px-4 relative">
          <Sidebar
            role="shop"
            onFilterChange={handleSidebarFilter}
          />
          <section className="flex-1 ml-0 md:ml-64 py-12 px-1 md:px-10 transition-all">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-blue-900 tracking-tight underline decoration-blue-400 decoration-2 underline-offset-4">
              Shop
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {pageProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.pricePerUnit}
                  image={product.imageUrl}
                />
              ))}
              {pageProducts.length === 0 && (
                <div className="col-span-4 text-center text-lg text-blue-700 py-16 bg-white bg-opacity-80 rounded-xl shadow">
                  No products found for these filters.
                </div>
              )}
            </div>

            {/* Pagination controls */}
            <div className="flex justify-center mt-12 space-x-1">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-full border font-semibold transition-all
                  ${currentPage === 1
                    ? "opacity-50 cursor-not-allowed bg-gray-100"
                    : "bg-white hover:bg-blue-200 border-blue-300 text-blue-900 shadow"
                  }`}
              >
                Prev
              </button>
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 mx-0.5 rounded-full border font-bold 
                    text-lg transition-all
                    ${currentPage === page
                      ? "bg-blue-900 text-white border-blue-900 shadow-lg"
                      : "bg-white border-blue-100 text-blue-900 hover:bg-blue-100"
                    }
                  `}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === numOfPages}
                className={`px-4 py-2 rounded-full border font-semibold transition-all
                  ${currentPage === numOfPages
                    ? "opacity-50 cursor-not-allowed bg-gray-100"
                    : "bg-white hover:bg-blue-200 border-blue-300 text-blue-900 shadow"
                  }`}
              >
                Next
              </button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
