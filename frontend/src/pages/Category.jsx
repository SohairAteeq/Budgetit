import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import AfterLoginNavbar from "../components/AfterLoginNavbar.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import { ApiEndPoints } from "../util/ApiEndPoints.js";
import Picker from "emoji-picker-react";

const emptyForm = { id: null, name: "", type: "EXPENSE", icon: "💡" };

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // form state
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [filterType, setFilterType] = useState("ALL");
  const [saving, setSaving] = useState(false);

  // dark mode toggle
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const filtered = useMemo(() => {
    if (filterType === "ALL") return categories;
    return categories.filter(
      (c) => (c.type || "").toUpperCase() === filterType
    );
  }, [categories, filterType]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axiosConfig.get(ApiEndPoints.categories);
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const startCreate = () => {
    setForm(emptyForm);
    setShowEmoji(false);
    setShowForm(true);
  };

  const startEdit = (cat) => {
    setForm({
      id: cat.id,
      name: cat.name || "",
      type: (cat.type || "EXPENSE").toUpperCase(),
      icon: cat.icon || "💡",
    });
    setShowEmoji(false);
    setShowForm(true);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const payload = { name: form.name.trim(), type: form.type, icon: form.icon };
    if (!payload.name) return;
    try {
      setSaving(true);
      if (form.id) {
        const res = await axiosConfig.put(
          ApiEndPoints.updateCategory(form.id),
          payload
        );
        const updated = res.data || payload;
        setCategories((prev) =>
          prev.map((c) => (c.id === form.id ? { ...c, ...updated } : c))
        );
      } else {
        const res = await axiosConfig.post(ApiEndPoints.categories, payload);
        const created = res.data || payload;
        setCategories((prev) => [{ ...created }, ...prev]);
      }
      setForm(emptyForm);
      setShowEmoji(false);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br 
      from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-black 
      text-gray-900 dark:text-white transition-colors duration-500 overflow-x-hidden">
      
      {/* Sidebar */}
      <div className="md:w-64">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
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

        {/* Content */}
        <div className="p-5 md:p-7 flex-1 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
              Categories
            </h1>

            {/* Filter + Create */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-white/10 dark:bg-gray-800 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors duration-500"
              >
                <option value="ALL">All</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
              <button
                onClick={startCreate}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 shadow-lg transition-transform duration-500 hover:scale-105 w-full sm:w-auto"
              >
                New Category
              </button>
            </div>
          </div>

          {/* Form (only visible when creating/editing) */}
          {showForm && (
            <div className="rounded-xl p-5 bg-white/40 dark:bg-white/5 backdrop-blur-lg shadow-lg mb-6 relative transition-colors duration-500">
              {saving && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
                  <div className="flex items-center gap-3 text-sm animate-pulse">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Saving...
                  </div>
                </div>
              )}
              <form
                onSubmit={submitForm}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
              >
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="e.g., Groceries, Salary"
                    className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/60 dark:bg-white/10 text-gray-900 dark:text-white focus:outline-none transition-colors duration-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, type: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/60 dark:bg-white/10 text-gray-900 dark:text-white focus:outline-none transition-colors duration-500"
                  >
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Icon
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowEmoji((s) => !s)}
                    className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/60 dark:bg-white/10 text-gray-900 dark:text-white text-left transition-colors duration-500"
                  >
                    <span className="text-xl">{form.icon}</span>
                  </button>
                  {showEmoji && (
                    <div className="fixed inset-0 z-[10000]">
                      <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setShowEmoji(false)}
                      />
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Picker
                          theme={darkMode ? "dark" : "light"}
                          onEmojiClick={(emoji) => {
                            const ch = emoji.emoji || emoji.native || "😀";
                            setForm((f) => ({ ...f, icon: ch }));
                            setShowEmoji(false);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg transition-transform duration-500 hover:scale-105 w-full sm:w-auto"
                  >
                    {form.id ? "Update Category" : "Create Category"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(emptyForm);
                      setShowForm(false);
                      setShowEmoji(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-white/60 dark:bg-white/10 border border-white/20 transition-colors duration-500 w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
            </div>
          )}

          {/* Categories Grid */}
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-28 rounded-xl bg-white/50 dark:bg-white/5 animate-pulse"
                  />
                ))
              ) : filtered.length > 0 ? (
                filtered.map((cat) => (
                  <div
                    key={cat.id}
                    className="group relative rounded-xl p-5 bg-white/60 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 backdrop-blur-lg shadow-lg text-left transition-all duration-500 hover:scale-105 overflow-hidden"
                  >
                    <span className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full group-hover:bg-cyan-500/40 transition duration-500" />
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{cat.icon || "🗂️"}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border transition-colors duration-500 ${
                          (cat.type || "EXPENSE").toUpperCase() === "INCOME"
                            ? "text-green-600 dark:text-green-300 border-green-400/40"
                            : "text-red-600 dark:text-red-300 border-red-400/40"
                        }`}
                      >
                        {(cat.type || "EXPENSE").toUpperCase()}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold">{cat.name}</h3>
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        onClick={() => startEdit(cat)}
                        className="px-3 py-1 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-sm hover:bg-white/70 dark:hover:bg-white/15 transition-colors duration-500"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-gray-500 dark:text-gray-400 text-center py-10">
                  No categories yet. Create your first one!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
