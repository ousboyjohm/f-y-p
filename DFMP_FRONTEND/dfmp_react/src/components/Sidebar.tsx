import { Link } from "react-router-dom";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  FaUserCircle,
  FaBoxOpen,
  // FaShoppingCart,
  FaUserCog,
  FaUsers,
  // FaListUl,
  FaLayerGroup,
  FaClipboardList,
  FaSortAmountUpAlt,
  FaFish,
  FaShip,
  FaGripLines,
  FaThLarge,
  FaTachometerAlt,
  FaHistory,
  FaShippingFast,
  FaPlus,
} from "react-icons/fa";

// Accept additionalProps so unknown props are ignored
interface SidebarProps {
  role: "customer" | "seller" | "admin" | "shop";
  onFilterChange?: (filters: {
    categories: string[];
    sort: string;
  }) => void;
  onSectionChange?: (section: "Dashboard" | "Users" | "Products" | "Orders") => void;
  onCustomerSectionChange?: (section: "Dashboard" | "Recent Orders" | "Track Order") => void;
  error?: Error | string | null;
  customerError?: Error | string | null;
  // Accept arbitrary props, to absorb unknown ones (e.g., from CustomerDashboard)
  [key: string]: any;
}

// Simple icons for categories
const categoryIcons: Record<string, ReactNode> = {
  Fish: <FaFish className="inline-block mr-2" />,
  Prawns: <FaShip className="inline-block mr-2" />,
  Crabs: <FaLayerGroup className="inline-block mr-2" />,
  Lobsters: <FaBoxOpen className="inline-block mr-2" />,
};

export default function Sidebar({
  role,
  onFilterChange,
  onSectionChange,
  onCustomerSectionChange,
  error,
  customerError,
  // ...rest  absorb unrecognized props like onNavigate, current, etc.
}: SidebarProps) {
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

  // Only display error for the admin role, as requested.
  const shouldShowAdminError =
    role === "admin" && (typeof error === "string" ? !!error : !!error?.message);

  // Only display customer error for the customer role
  const shouldShowCustomerError =
    role === "customer" &&
    (typeof customerError === "string"
      ? !!customerError
      : !!customerError?.message);

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-blue-900 text-white shadow-xl p-6 overflow-y-auto flex flex-col border-r border-blue-700">
      <div className="mb-5 flex items-center gap-2 text-2xl font-extrabold tracking-tight">
        <FaGripLines className="text-blue-300" />
        <span className="text-blue-200">Menu</span>
      </div>

      {shouldShowAdminError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
          <strong>Error:</strong>{" "}
          {typeof error === "string" ? error : error?.message || "Unknown error"}
        </div>
      )}

      {shouldShowCustomerError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
          <strong>Error:</strong>{" "}
          {typeof customerError === "string"
            ? customerError
            : customerError?.message || "Unknown error"}
        </div>
      )}

      {role === "shop" && (
        <section className="mb-8">
          <h3 className="font-semibold mb-4 flex items-center text-blue-200">
            <FaThLarge className="mr-2" />
            Filter By
          </h3>

          <div className="mb-6">
            <h4 className="font-medium mb-2">Category</h4>
            {["Fish", "Prawns", "Crabs", "Lobsters"].map((cat) => (
              <label
                key={cat}
                className="flex items-center mb-2 rounded px-2 py-1 hover:bg-blue-800 transition"
              >
                <input
                  type="checkbox"
                  className="accent-blue-400 mr-2"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryToggle(cat)}
                />
                {categoryIcons[cat] || null}
                <span className="ml-1">{cat}</span>
              </label>
            ))}
          </div>

          <div>
            <label
              htmlFor="sort"
              className="font-medium block mb-2 flex items-center"
            >
              <FaSortAmountUpAlt className="mr-2" />
              Sort By
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border border-blue-400 rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-900 text-white"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </section>
      )}

      {role === "customer" && (
        <nav className="mb-10">
          <h3 className="text-xs uppercase tracking-widest text-blue-300 mb-3 font-bold flex items-center">
            <FaUserCircle className="mr-2" />
            Customer Menu
          </h3>
          <ul className="space-y-2 text-base">
            <li>
              {onCustomerSectionChange ? (
                <button
                  className="flex w-full text-left items-center gap-2 px-3 py-2 rounded hover:bg-blue-800 transition"
                  onClick={() => onCustomerSectionChange("Dashboard")}
                  type="button"
                >
                  <FaTachometerAlt /> Dashboard
                </button>
              ) : (
                <Link
                  to="/customer"
                  state={{ section: "Dashboard" }}
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-800 transition"
                >
                  <FaTachometerAlt /> Dashboard
                </Link>
              )}
            </li>
            <li>
              {onCustomerSectionChange ? (
                <button
                  className="flex w-full text-left items-center gap-2 px-3 py-2 rounded hover:bg-blue-800 transition"
                  onClick={() => onCustomerSectionChange("Recent Orders")}
                  type="button"
                >
                  <FaHistory /> Order History
                </button>
              ) : (
                <Link
                  to="/customer"
                  state={{ section: "Recent Orders" }}
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-800 transition"
                >
                  <FaHistory /> Order History
                </Link>
              )}
            </li>
            <li>
              {onCustomerSectionChange ? (
                <button
                  className="flex w-full text-left items-center gap-2 px-3 py-2 rounded hover:bg-blue-800 transition"
                  onClick={() => onCustomerSectionChange("Track Order")}
                  type="button"
                >
                  <FaShippingFast /> Track Order
                </button>
              ) : (
                <Link
                  to="/customer"
                  state={{ section: "Track Order" }}
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-800 transition"
                >
                  <FaShippingFast /> Track Order
                </Link>
              )}
            </li>
          </ul>
        </nav>
      )}

      {role === "seller" && (
        <nav className="mb-10">
          <h3 className="text-xs uppercase tracking-widest text-blue-300 mb-3 font-bold flex items-center">
            <FaBoxOpen className="mr-2" />
            Seller Menu
          </h3>
          <ul className="space-y-2 text-base">
            <li>
              <Link
                to="/seller"
                state={{ section: "Dashboard" }}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-800 transition"
              >
                <FaTachometerAlt /> Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/seller"
                state={{ section: "Products" }}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-800 transition"
              >
                <FaThLarge /> Products
              </Link>
            </li>
            <li>
              <Link
                to="/add-product"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-800 transition"
              >
                <FaPlus /> Add Product
              </Link>
            </li>
            <li>
              <Link
                to="/seller"
                state={{ section: "Orders" }}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-800 transition"
              >
                <FaClipboardList /> Orders
              </Link>
            </li>
          </ul>
        </nav>
      )}

      {role === "admin" && (
        <nav>
          <h3 className="text-xs uppercase tracking-widest text-blue-300 mb-3 font-bold flex items-center">
            <FaUserCog className="mr-2" />
            Admin Menu
          </h3>
          <ul className="space-y-2 text-base">
            <li>
              {onSectionChange ? (
                <button
                  className="flex w-full text-left items-center gap-2 px-3 py-2 rounded hover:bg-blue-800 transition"
                  onClick={() => onSectionChange("Dashboard")}
                  type="button"
                >
                  <FaTachometerAlt /> Dashboard
                </button>
              ) : (
                <Link
                  to="/admin"
                  state={{ section: "Dashboard" }}
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-800 transition"
                >
                  <FaTachometerAlt /> Dashboard
                </Link>
              )}
            </li>
            <li>
              {onSectionChange ? (
                <button
                  className="flex w-full text-left items-center gap-2 px-3 py-2 rounded hover:bg-blue-800 transition"
                  onClick={() => onSectionChange("Users")}
                  type="button"
                >
                  <FaUsers /> Users
                </button>
              ) : (
                <Link
                  to="/admin"
                  state={{ section: "Users" }}
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-800 transition"
                >
                  <FaUsers /> Users
                </Link>
              )}
            </li>
            <li>
              {onSectionChange ? (
                <button
                  className="flex w-full text-left items-center gap-2 px-3 py-2 rounded hover:bg-blue-800 transition"
                  onClick={() => onSectionChange("Products")}
                  type="button"
                >
                  <FaThLarge /> Product
                </button>
              ) : (
                <Link
                  to="/admin"
                  state={{ section: "Products" }}
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-800 transition"
                >
                  <FaThLarge /> Product
                </Link>
              )}
            </li>
            <li>
              {onSectionChange ? (
                <button
                  className="flex w-full text-left items-center gap-2 px-3 py-2 rounded hover:bg-blue-800 transition"
                  onClick={() => onSectionChange("Orders")}
                  type="button"
                >
                  <FaClipboardList /> Orders
                </button>
              ) : (
                <Link
                  to="/admin"
                  state={{ section: "Orders" }}
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-800 transition"
                >
                  <FaClipboardList /> Orders
                </Link>
              )}
            </li>
          </ul>
        </nav>
      )}
    </aside>
  );
}