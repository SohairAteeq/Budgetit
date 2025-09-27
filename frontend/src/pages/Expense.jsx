import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import AfterLoginNavbar from "../components/AfterLoginNavbar.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import { ApiEndPoints } from "../util/ApiEndPoints.js";
import { Download, Mail, DollarSign, List } from "lucide-react";
import Footer from "../components/Footer.jsx";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Picker from "emoji-picker-react";

const emptyForm = { amount: "", name: "", categoryId: "", icon: "💸" };

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Emoji picker + form visibility
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

  const total = useMemo(() => {
    return expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  }, [expenses]);

  const monthlyData = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      const d = new Date(e.createdAt || e.date || Date.now());
      const key = `${d.toLocaleString("default", {
        month: "short",
      })} ${d.getFullYear()}`;
      map[key] = (map[key] || 0) + Number(e.amount || 0);
    });
    return Object.keys(map).map((month) => ({
      month,
      amount: map[month],
    }));
  }, [expenses]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [expensesRes, categoriesRes] = await Promise.all([
          axiosConfig.get(ApiEndPoints.expenses),
          axiosConfig.get(ApiEndPoints.categories),
        ]);
        setExpenses(Array.isArray(expensesRes.data) ? expensesRes.data : []);
        setCategories(
          (Array.isArray(categoriesRes.data) ? categoriesRes.data : []).filter(
            (c) => (c.type || "").toUpperCase() === "EXPENSE"
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
      const res = await axiosConfig.post(ApiEndPoints.expenses, payload);
      const created = res.data || payload;
      setExpenses((prev) => [created, ...prev]);
      setForm(emptyForm);
      setShowEmoji(false);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add expense");
    } finally {
      setSaving(false);
    }
  };

  const deleteExpense = async (expense) => {
    if (!expense?.id) return;
    const ok = window.confirm(`Delete expense "${expense.name}"?`);
    if (!ok) return;
    try {
      await axiosConfig.delete(ApiEndPoints.deleteExpense(expense.id));
      setExpenses((prev) => prev.filter((e) => e.id !== expense.id));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete expense");
    }
  };

  const handleCloseEmoji = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowEmoji(false);
      setIsClosing(false);
    }, 250);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-black text-gray-900 dark:text-white transition-colors duration-500">
      <Sidebar />

      <div className="flex-1 flex overflow-hidden flex-col">
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

        <div className="p-5 md:p-7 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-red-400 to-rose-500 text-transparent bg-clip-text">
              Expenses
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-300">
                Total this month:{" "}
                <span className="font-semibold text-red-400">
                  ${total.toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => {
                  setForm(emptyForm);
                  setShowForm(true);
                }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-lg transition-transform duration-500 hover:scale-105"
              >
                New Expense
              </button>
            </div>
          </div>

          {/* Create Expense Form */}
          {showForm && (
            <div className="rounded-2xl p-6 bg-white/40 dark:bg-white/5 backdrop-blur-lg shadow-lg border border-red-400/20">
              <form
                onSubmit={submitForm}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              >
                {/* Name */}
                <div className="col-span-1">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Name
                  </label>
                  <div className="relative">
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder="e.g., Rent"
                      className="w-full px-10 py-2 rounded-lg border border-red-400/30 bg-white/60 dark:bg-gray-700/40 focus:ring-2 focus:ring-red-400 outline-none"
                    />
                    <DollarSign
                      className="absolute left-3 top-2.5 text-red-400"
                      size={18}
                    />
                  </div>
                </div>

                {/* Amount */}
                <div className="col-span-1">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Amount
                  </label>
                  <input
                    value={form.amount}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, amount: e.target.value }))
                    }
                    type="number"
                    min="0"
                    step="0.01"
                    className="no-spinner w-full px-3 py-2 rounded-lg border border-red-400/30 bg-white/60 dark:bg-gray-700/40 focus:ring-2 focus:ring-red-400 outline-none"
                  />
                </div>

                {/* Category */}
                <div className="col-span-1">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={form.categoryId}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, categoryId: e.target.value }))
                      }
                      className="appearance-none w-full px-10 py-2 rounded-lg border border-red-400/30 bg-white/60 dark:bg-gray-700/40 focus:ring-2 focus:ring-red-400 outline-none"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                    <List
                      className="pointer-events-none absolute left-3 top-2.5 text-red-400"
                      size={18}
                    />
                  </div>
                </div>

                {/* Icon + Buttons */}
                <div className="flex gap-2 items-end">
                  <button
                    type="button"
                    onClick={() => setShowEmoji(true)}
                    className="flex-1 px-3 py-2 rounded-xl border border-red-400/30 bg-white/60 dark:bg-gray-700/40 text-left"
                  >
                    <span className="text-xl">{form.icon}</span>
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow text-white transition"
                  >
                    {saving ? "Saving..." : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setForm(emptyForm);
                      setShowEmoji(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
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
                    const ch = emoji.emoji || emoji.native || "💸";
                    setForm((f) => ({ ...f, icon: ch }));
                    handleCloseEmoji();
                  }}
                />
              </div>
            </div>
          )}

          {/* Chart + List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart */}
            <div className="rounded-xl p-5 bg-white/40 dark:bg-white/5 backdrop-blur-lg shadow-lg border border-red-400/20">
              <h3 className="text-lg font-semibold mb-4 text-red-400">
                Monthly Expense Distribution
              </h3>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="month" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #f87171",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="amount" fill="#f87171" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-40 flex items-center justify-center text-gray-400">
                  No data yet to display chart.
                </div>
              )}
            </div>

            {/* Recent Expenses */}
            <div className="rounded-xl p-5 bg-white/40 dark:bg-white/5 backdrop-blur-lg shadow-lg border border-red-400/20">
              <h3 className="text-lg font-semibold mb-3 text-red-400">
                Recent Expenses
              </h3>
              {loading ? (
                <div className="h-48 flex items-center justify-center text-gray-400">
                  Loading...
                </div>
              ) : expenses.length > 0 ? (
                <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {expenses.map((exp) => (
                    <li
                      key={exp.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/20 dark:bg-gray-700/30 hover:bg-red-500/10 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-red-500/20">
                          <span className="text-lg">
                            {typeof exp.icon === "string" && exp.icon
                              ? exp.icon
                              : "💸"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{exp.name}</p>
                          <p className="text-xs text-gray-400">
                            {exp.category?.icon} {exp.category?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-red-400">
                          -${Number(exp.amount || 0).toLocaleString()}
                        </span>
                        <button
                          onClick={() => deleteExpense(exp)}
                          className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-400/30 text-sm text-red-400 hover:bg-red-500/20"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400">No expenses yet.</div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-6">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-400/30 hover:bg-blue-500/20 text-blue-400">
              <Mail size={18} /> Email Data
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-400/30 hover:bg-purple-500/20 text-purple-400">
              <Download size={18} /> Download Data
            </button>
          </div>
        </div>
        <Footer/>
      </div>

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

export default Expenses;
