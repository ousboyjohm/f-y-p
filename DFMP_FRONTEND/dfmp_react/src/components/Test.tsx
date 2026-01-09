import React from "react";

interface SidebarProps {
  role: "customer" | "seller" | "admin" | "shop";
}

const Test: React.FC<SidebarProps> = ({ role }) => {
  const commonClasses = "block mb-2 text-gray-700 hover:text-blue-900 cursor-pointer";

  return (
    <aside className="w-64 fixed top-20 h-[calc(100vh-5rem)] overflow-y-auto bg-white shadow p-4">
      {role === "shop" && (
        <section>
          <h3 className="font-semibold mb-4">Filter By</h3>

          <div className="mb-6">
            <h4 className="font-medium mb-2">Category</h4>
            <label className="block mb-1"><input type="checkbox" /> Fish</label>
            <label className="block mb-1"><input type="checkbox" /> Prawns</label>
            <label className="block mb-1"><input type="checkbox" /> Crabs</label>
            <label className="block mb-1"><input type="checkbox" /> Lobsters</label>
          </div>

          <div className="mb-6">
            <label htmlFor="priceRange" className="block font-medium mb-2">Price Range</label>
            <input id="priceRange" type="range" min="0" max="1000" step="50" className="w-full" />
          </div>

          <div>
            <label htmlFor="sort" className="font-medium block mb-2">Sort By</label>
            <select id="sort" className="border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
              <option>Popularity</option>
            </select>
          </div>
        </section>
      )}

      {role === "customer" && (
        <nav>
          <h3 className="font-semibold mb-4">Customer Dashboard</h3>
          <a className={commonClasses}>Dashboard</a>
          <a className={commonClasses}>Order History</a>
          <a className={commonClasses}>Track Order</a>
          <a className={commonClasses}>Profile Settings</a>
        </nav>
      )}

      {role === "seller" && (
        <nav>
          <h3 className="font-semibold mb-4">Seller Dashboard</h3>
          <a className={commonClasses}>Dashboard</a>
          <a className={commonClasses}>My Products</a>
          <a className={commonClasses}>Add Product</a>
          <a className={commonClasses}>Orders Received</a>
          <a className={commonClasses}>Profile Settings</a>
        </nav>
      )}

      {role === "admin" && (
        <nav>
          <h3 className="font-semibold mb-4">Admin Dashboard</h3>
          <a className={commonClasses}>Dashboard</a>
          <a className={commonClasses}>User Management</a>
          <a className={commonClasses}>Product Management</a>
          <a className={commonClasses}>Order Management</a>
          <a className={commonClasses}>Reports</a>
        </nav>
      )}
    </aside>
  );
};

export default Test;