import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import AfterLoginNavbar from "../components/AfterLoginNavbar.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import { ApiEndPoints } from "../util/ApiEndPoints.js";
import { Download, Mail, DollarSign, List } from "lucide-react";
import Footer from "../components/Footer.jsx";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Picker from "emoji-picker-react";

const emptyForm = { amount: "", name: "", categoryId: "", icon: "💰" };

// ✅ format date for tooltip
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [showEmoji, setShowEmoji] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Total income
  const total = useMemo(() => {
    return incomes.reduce((sum, i) => sum + Number(i.amount || 0), 0);
  }, [incomes]);

  // Line data with full date
  const lineData = useMemo(() => {
    return incomes
      .map((income) => {
        const d = new Date(income.createdAt || income.date || Date.now());
        return {
          fullDate: d,
          amount: Number(income.amount || 0),
        };
      })
      .sort((a, b) => a.fullDate - b.fullDate);
  }, [incomes]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [incomesRes, categoriesRes] = await Promise.all([
          axiosConfig.get(ApiEndPoints.incomes),
          axiosConfig.get(ApiEndPoints.categories),
        ]);
        setIncomes(Array.isArray(incomesRes.data) ? incomesRes.data : []);
        setCategories(
          (Array.isArray(categoriesRes.data) ? categoriesRes.data : []).filter(
            (c) => (c.type || "").toUpperCase() === "INCOME"
          )
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Submit income
  const submitForm = async (e) => {
    e.preventDefault();
    const payload = {
      amount: Number(form.amount),
      name: form.name.trim(),
      categoryId: form.categoryId,
      icon: form.icon,
    };
    if (!payload.amount || !payload.name || !payload.categoryId) return;
    try {
      setSaving(true);
      const res = await axiosConfig.post(ApiEndPoints.incomes, payload);
      const created = res.data || payload;
      setIncomes((prev) => [created, ...prev]);
      setForm(emptyForm);
      setShowEmoji(false);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add income");
    } finally {
      setSaving(false);
    }
  };

  // Delete income
  const deleteIncome = async (income) => {
    if (!income?.id) return;
    const ok = window.confirm(`Delete income "${income.name}"?`);
    if (!ok) return;
    try {
      await axiosConfig.delete(ApiEndPoints.deleteIncome(income.id));
      setIncomes((prev) => prev.filter((i) => i.id !== income.id));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete income");
    }
  };

  // Smooth close emoji picker
  const handleCloseEmoji = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowEmoji(false);
      setIsClosing(false);
    }, 250);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-black text-gray-900 dark:text-white transition-colors duration-500">
      <Sidebar />

      {/* Content area with flex column layout */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="sticky top-0 z-50">
          <AfterLoginNavbar>
            <button
              onClick={() => setDarkMode((d) => !d)}
              className="ml-4 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-500
                bg-gray-200 hover:bg-gray-300 text-gray-900
                dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </AfterLoginNavbar>
        </div>

        {/* Main content (flex-1 keeps footer at natural bottom) */}
        <main className="flex-1 p-5 md:p-7 space-y-6 overflow-y-auto overflow-x-hidden w-full max-w-full">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
              Incomes
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                Total this month:{" "}
                <span className="font-semibold text-green-400">
                  ${total.toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => {
                  setForm(emptyForm);
                  setShowForm(true);
                }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg text-white transition-transform duration-500 hover:scale-105 whitespace-nowrap"
              >
                New Income
              </button>
            </div>
          </div>

          {/* Create Income Form */}
          {showForm && (
            <div className="rounded-2xl p-6 bg-white/40 dark:bg-white/5 backdrop-blur-lg shadow-lg border border-green-400/20 w-full">
              <form
                onSubmit={submitForm}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {/* Name */}
                <div className="w-full">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="e.g., Salary"
                    className="w-full px-3 py-2 rounded-lg border border-green-400/30 bg-white/60 dark:bg-gray-700/40 focus:ring-2 focus:ring-green-400 outline-none"
                  />
                </div>

                {/* Amount */}
                <div className="w-full">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Amount
                  </label>
                  <div className="relative">
                    <input
                      value={form.amount}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, amount: e.target.value }))
                      }
                      type="number"
                      min="0"
                      step="0.01"
                      className="no-spinner w-full pl-10 pr-3 py-2 rounded-lg border border-green-400/30 bg-white/60 dark:bg-gray-700/40 focus:ring-2 focus:ring-green-400 outline-none"
                    />
                    <DollarSign
                      className="absolute left-3 top-2.5 text-green-400"
                      size={18}
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="w-full">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={form.categoryId}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, categoryId: e.target.value }))
                      }
                      className="appearance-none w-full px-10 py-2 rounded-lg border border-green-400/30 bg-white/60 dark:bg-gray-700/40 focus:ring-2 focus:ring-green-400 outline-none"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                    <List
                      className="pointer-events-none absolute left-3 top-2.5 text-green-400"
                      size={18}
                    />
                  </div>
                </div>

                {/* Icon + Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-row gap-2 items-stretch w-full lg:col-span-3">
                  {/* Icon */}
                  <button
                    type="button"
                    onClick={() => setShowEmoji(true)}
                    className="flex-1 px-3 py-2 rounded-xl border border-green-400/30 bg-white/60 dark:bg-gray-700/40 text-left"
                  >
                    <span className="text-xl">{form.icon}</span>
                  </button>

                  {/* Add */}
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 min-w-[90px] rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow text-white transition"
                  >
                    {saving ? "Saving..." : "Add"}
                  </button>

                  {/* Cancel */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setForm(emptyForm);
                      setShowEmoji(false);
                    }}
                    className="px-4 py-2 min-w-[80px] rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
            </div>
          )}

          {/* Emoji Picker */}
          {showEmoji && (
            <div className="fixed inset-0 z-[10050] flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={handleCloseEmoji}
              />
              <div
                className={`relative ${
                  isClosing ? "animate-emojiClose" : "animate-emojiOpen"
                }`}
              >
                <Picker
                  theme={darkMode ? "dark" : "light"}
                  onEmojiClick={(emoji) => {
                    const ch = emoji.emoji || emoji.native || "💰";
                    setForm((f) => ({ ...f, icon: ch }));
                    handleCloseEmoji();
                  }}
                />
              </div>
            </div>
          )}

          {/* Chart + List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Line Chart */}
            <div className="rounded-xl p-5 bg-white/40 dark:bg-white/5 backdrop-blur-lg shadow-lg border border-green-400/20 overflow-hidden">
              <h3 className="text-lg font-semibold mb-4 text-green-400">
                Income Over Time
              </h3>
              {lineData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      formatter={(value) => [`$${value.toLocaleString()}`, "Amount"]}
                      labelFormatter={(label, payload) =>
                        payload && payload[0]
                          ? formatDate(payload[0].payload.fullDate)
                          : ""
                      }
                      contentStyle={{
                        backgroundColor: darkMode ? "#111827" : "#f9fafb",
                        border: "1px solid #34d399",
                        borderRadius: "8px",
                        color: darkMode ? "#fff" : "#111",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#34d399"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#34d399" }}
                      activeDot={{ r: 7, fill: "#10b981" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-40 flex items-center justify-center text-gray-400">
                  No data yet to display chart.
                </div>
              )}
            </div>

            {/* Monthly Incomes */}
            <div className="rounded-xl p-5 bg-white/40 dark:bg-white/5 backdrop-blur-lg shadow-lg border border-green-400/20 overflow-hidden">
              <h3 className="text-lg font-semibold mb-3 text-green-400">
                Monthly Incomes
              </h3>
              {loading ? (
                <div className="h-48 flex items-center justify-center text-gray-400">
                  Loading...
                </div>
              ) : incomes.length > 0 ? (
                <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {incomes.map((inc) => (
                    <li
                      key={inc.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/20 dark:bg-gray-700/30 hover:bg-green-500/10 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-green-500/20">
                          <span className="text-lg">
                            {typeof inc.icon === "string" && inc.icon
                              ? inc.icon
                              : "💰"}
                          </span>
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-medium truncate">{inc.name}</p>
                          <p className="text-xs text-gray-400 truncate">
                            {inc.category?.icon} {inc.category?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-sm font-semibold text-green-400 whitespace-nowrap">
                          +${Number(inc.amount || 0).toLocaleString()}
                        </span>
                        <button
                          onClick={() => deleteIncome(inc)}
                          className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-400/30 text-sm text-red-400 hover:bg-red-500/20 whitespace-nowrap"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400">No incomes yet.</div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-end gap-4 mt-6">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-400/30 hover:bg-blue-500/20 text-blue-400 whitespace-nowrap">
              <Mail size={18} /> Email Data
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-400/30 hover:bg-purple-500/20 text-purple-400 whitespace-nowrap">
              <Download size={18} /> Download Data
            </button>
          </div>
        </main>

        {/* Footer (sits naturally after content) */}
        <Footer />
      </div>

      {/* Extra styles */}
      <style>{`
        input[type=number].no-spinner::-webkit-inner-spin-button,
        input[type=number].no-spinner::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number].no-spinner {
          -moz-appearance: textfield;
        }

        @keyframes emojiOpen {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes emojiClose {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.8); }
        }
        .animate-emojiOpen {
          animation: emojiOpen 0.25s ease-out forwards;
        }
        .animate-emojiClose {
          animation: emojiClose 0.25s ease-in forwards;
        }
      `}</style>
    </div>
  );
};

export default Income;
