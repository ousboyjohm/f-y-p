import { Link } from "react-router-dom";
import { useState } from "react";

interface SidebarProps {
  role: "customer" | "seller" | "admin" | "shop";
  onFilterChange?: (filters: {
    categories: string[];
    sort: string;
  }) => void;
}


export default function Sidebar({ role, onFilterChange } : SidebarProps){

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("default");

  const handleCategoryToggle = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updated);
    triggerUpdate(updated, sortOption);
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    triggerUpdate(selectedCategories, value);
  };

  const triggerUpdate = (categories: string[], sort: string) => {
    if (onFilterChange) {
      onFilterChange({ categories, sort });
    }
  };

    return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-blue-800 text-white shadow-lg p-6 overflow-y-auto">
      <h1 className="mb-3 text-lg font-bold">Sidebar</h1>
            
          {role === "shop" && (
            <section>
            <h3 className="font-semibold mb-4">Filter By</h3>

            <div className="mb-6">
              <h4 className="font-medium mb-2">Category</h4>
              {["Fish", "Prawns", "Crabs", "Lobsters"].map((cat) => (
              <label key={cat} className="block mb-1">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryToggle(cat)}
                />
                {cat}
              </label>
            ))}
            </div>

            {/* <div className="mb-6">
              <label htmlFor="priceRange" className="block font-medium mb-2">Price Range</label>
              <input id="priceRange" type="range" min="0" max="1000" step="50" className="w-full" />
            </div> */}

            <div>
              <label htmlFor="sort" className="font-medium block mb-2">Sort By</label>
              <select
              id="sort"
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border rounded w-full px-3 py-2 focus:outline-none 
                         focus:ring-2 focus:ring-blue-500 bg-blue-800"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              {/* <option>Newest</option>
              <option>Popularity</option> */}
            </select>
            </div>
          </section>
        )}

      {/* Customer Section */}
      {role === "customer" && (
      <div className="mb-8">
        <h3 className="text-sm uppercase tracking-wide text-blue-300 mb-3">Customer Menu</h3>
        <ul className="space-y-3">
          <li><Link to="/customer" state={{ section: "Dashboard" }} className="hover:text-blue-300">Dashboard</Link></li>
          <li><Link to="/customer" state={{ section: "Recent Orders" }} className="hover:text-blue-300">Order History</Link></li>
          <li><Link to="/customer" state={{ section: "Track Order" }} className="hover:text-blue-300">Track Order</Link></li>
          {/* <li><Link to="/profile" className="hover:text-blue-300">Profile Settings</Link></li> */}
          <li>
</li>

        </ul>
      </div>
      )}


      {role === "seller" && (
      <div>
        <h3 className="text-sm uppercase tracking-wide text-blue-300 mb-3">Seller Menu</h3>
        <ul className="space-y-3">
          <li><Link to="/seller" className="hover:text-blue-300">Dashboard</Link></li>
          <li><Link to="/seller/products" className="hover:text-blue-300">My Products</Link></li>
          <li><Link to="/add-product" className="hover:text-blue-300">Add Product</Link></li>
          <li><Link to="/seller/orders" className="hover:text-blue-300">Orders Received</Link></li>
        </ul>
      </div>
      )}
    </aside>
  );
}