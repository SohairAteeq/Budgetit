import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  List,
  Wallet,
  CreditCard,
  Filter,
  Menu,
  X,
} from "lucide-react";
import defaultImage from "../assets/default_image2.jpg";

const Sidebar = () => {
  const { user, sidebarOpen, setSidebarOpen } = useContext(AppContext);
  const [docked, setDocked] = useState(false);

  // auto dock the toggle button after 3s of inactivity
  useEffect(() => {
    if (sidebarOpen) return; // don’t dock while sidebar is open
    const timer = setTimeout(() => setDocked(true), 3000);
    return () => clearTimeout(timer);
  }, [sidebarOpen]);

  return (
    <>
      {/* Overlay for mobile */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 bg-gray-900/30 dark:bg-black/40 backdrop-blur-sm z-[9998] 
        md:hidden transition-opacity duration-300 ease-in-out
        ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 md:w-64 z-[9999]
          flex flex-col p-6 border-r shadow-xl
          transition-all duration-300 ease-in-out will-change-transform
          ${sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
          md:translate-x-0 md:opacity-100 md:static

          /* Light Mode */
          bg-gradient-to-b from-gray-100 via-white to-gray-100
          border-gray-200 text-gray-800

          /* Dark Mode */
          dark:from-gray-950 dark:via-gray-900 dark:to-black
          dark:border-gray-700/50 dark:text-gray-100
        `}
      >
        {/* Close button (mobile only) */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden absolute top-5 right-5 
                     bg-gradient-to-r from-blue-500 to-indigo-500 
                     text-white p-2 rounded-full shadow-lg 
                     hover:scale-110 transition-transform duration-300"
        >
          <X size={20} />
        </button>

        {/* Profile Section */}
        <div
          className={`flex flex-col items-center mt-5 transition-opacity duration-500 ease-in-out
            ${sidebarOpen ? "opacity-100" : "opacity-0"} md:opacity-100`}
        >
          <div className="relative group">
            <img
              src={user?.profileImageUrl || defaultImage}
              alt={user?.fullName || "Guest"}
              className="w-24 h-24 rounded-full border-4 
                         border-indigo-500/70 object-cover shadow-lg 
                         group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h2 className="mt-3 text-lg md:text-base font-semibold text-gray-800 dark:text-gray-100 text-center tracking-wide">
            {user?.fullName || "Guest"}
          </h2>
          <p className="text-sm md:text-xs text-gray-500 dark:text-gray-400 truncate">
            {user?.email || "No email available"}
          </p>
        </div>

        {/* Navigation Links */}
        <ul className="mt-10 flex-1 space-y-3">
          {[
            { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
            { to: "/category", icon: <List size={20} />, label: "Category" },
            { to: "/income", icon: <Wallet size={20} />, label: "Income" },
            { to: "/expense", icon: <CreditCard size={20} />, label: "Expense" },
            { to: "/filter", icon: <Filter size={20} />, label: "Filter" },
          ].map((item, idx) => (
            <li
              key={item.to}
              className={`transition-opacity duration-500 ease-in-out
                ${sidebarOpen ? "opacity-100" : "opacity-0"} md:opacity-100`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <NavItem to={item.to} icon={item.icon}>
                {item.label}
              </NavItem>
            </li>
          ))}
        </ul>
      </aside>

      {/* Sidebar Toggle Button (Mobile Only) */}
      <button
        onClick={() => {
          if (sidebarOpen) {
            setSidebarOpen(false); // close if already open
          } else {
            setSidebarOpen(true);
            setDocked(false);
          }
        }}
        className={`fixed z-[10000] transition-all duration-500 ease-in-out md:hidden
          ${
            docked
              ? "left-0 bottom-1/2 w-2.5 h-20 rounded-r-xl"
              : "left-5 bottom-5 p-3 rounded-full"
          }
          bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg
          hover:scale-110 futuristic-glow`}
      >
        {docked ? "" : sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </>
  );
};

const NavItem = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ease-in-out
      ${
        isActive
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
          : "text-gray-700 hover:bg-gray-200/70 dark:text-gray-300 dark:hover:bg-gray-800/70"
      }`
    }
  >
    {icon}
    <span className="text-base md:text-sm font-medium tracking-wide">{children}</span>
  </NavLink>
);

export default Sidebar;
