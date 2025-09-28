import { useState, useMemo } from "react";
import Sidebar from "../components/Sidebar.jsx";
import AfterLoginNavbar from "../components/AfterLoginNavbar.jsx";
import Footer from "../components/Footer.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import { ApiEndPoints } from "../util/ApiEndPoints.js";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Filter as FilterIcon } from "lucide-react";

const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Filter = () => {
  const [filters, setFilters] = useState({
    type: "income",
    startDate: "",
    endDate: "",
    keyword: "",
    sortBy: "date",
    sortOrder: "desc",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({ total: 0, count: 0 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const submitFilters = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axiosConfig.post(ApiEndPoints.filters, {
        ...filters,
        startDate: filters.startDate || null,
        endDate: filters.endDate || null,
      });

      const cleanData = Array.isArray(data)
        ? data.filter((item) => item && item.name && item.amount != null)
        : [];

      setResults(cleanData);

      const total = cleanData.reduce(
        (acc, item) => acc + (item.amount ? Number(item.amount) : 0),
        0
      );
      setSummary({ total, count: cleanData.length });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch filtered data");
    } finally {
      setLoading(false);
    }
  };

  const lineData = useMemo(() => {
    return results
      .map((r) => {
        const d = new Date(r.date || r.createdAt || Date.now());
        return {
          fullDate: d,
          amount: Number(r.amount || 0),
          name: r.name,
          icon: r.icon,
        };
      })
      .sort((a, b) => a.fullDate - b.fullDate);
  }, [results]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-900 dark:via-black dark:to-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-50">
          <AfterLoginNavbar />
        </div>

        <main className="flex-1 overflow-y-auto p-5 md:p-7 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-500 text-transparent bg-clip-text drop-shadow-lg">
              Filter Transactions
            </h1>
            <div className="flex items-center gap-2 text-sm opacity-80">
              <FilterIcon className="w-4 h-4 text-cyan-400" />
              Refine your results with advanced filters
            </div>
          </div>

          {/* Filter Form */}
          <form
            onSubmit={submitFilters}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-5 rounded-2xl shadow-lg border border-cyan-300/40 dark:border-cyan-700/40"
          >
            {["type", "startDate", "endDate", "keyword", "sortBy", "sortOrder"].map(
              (field) => (
                <div key={field}>
                  <label className="block text-xs uppercase tracking-wider mb-1 opacity-70">
                    {field}
                  </label>
                  {field === "keyword" ? (
                    <input
                      type="text"
                      name="keyword"
                      placeholder="Search by name"
                      value={filters.keyword}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border bg-white/80 dark:bg-gray-900/70 backdrop-blur-md focus:ring-2 focus:ring-cyan-400"
                    />
                  ) : field.includes("Date") ? (
                    <input
                      type="date"
                      name={field}
                      value={filters[field]}
                      max={today}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border bg-white/80 dark:bg-gray-900/70 text-gray-900 dark:text-gray-100 
                      [&::-webkit-calendar-picker-indicator]:invert dark:[&::-webkit-calendar-picker-indicator]:invert"
                    />
                  ) : (
                    <select
                      name={field}
                      value={filters[field]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border bg-white/80 dark:bg-gray-900/70"
                    >
                      {field === "type" && (
                        <>
                          <option value="income">Income</option>
                          <option value="expense">Expense</option>
                        </>
                      )}
                      {field === "sortBy" && (
                        <>
                          <option value="date">Date</option>
                          <option value="amount">Amount</option>
                          <option value="name">Name</option>
                        </>
                      )}
                      {field === "sortOrder" && (
                        <>
                          <option value="asc">Ascending</option>
                          <option value="desc">Descending</option>
                        </>
                      )}
                    </select>
                  )}
                </div>
              )
            )}

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-md hover:scale-[1.02] transition w-full"
              >
                {loading ? "Filtering..." : "Apply Filters"}
              </button>
            </div>
          </form>

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Summary */}
          {results.length > 0 && (
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-xl shadow p-4 border border-cyan-300/30 dark:border-cyan-700/40">
              <p>
                Found <b>{summary.count}</b> transactions — Total:{" "}
                <span className="font-bold text-cyan-400">
                  ${summary.total.toLocaleString()}
                </span>
              </p>
            </div>
          )}

          {/* Chart + Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Line Chart */}
            <div className="rounded-xl p-5 bg-white/40 dark:bg-gray-800/60 backdrop-blur-lg shadow-lg border border-cyan-400/20 overflow-hidden">
              <h3 className="text-lg font-semibold mb-4 text-cyan-400">
                Transactions Over Time
              </h3>
              {lineData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <YAxis stroke="#888" className="dark:stroke-gray-400" />
                    <Tooltip
                      content={({ payload }) => {
                        if (!payload || !payload.length) return null;
                        const { amount, name, fullDate } = payload[0].payload;
                        return (
                          <div className="p-3 rounded-lg shadow-lg bg-gray-900 text-white border border-cyan-400/40">
                            <p className="font-semibold">{name}</p>
                            <p>Date: {formatDate(fullDate)}</p>
                            <p>Amount: ${amount.toLocaleString()}</p>
                          </div>
                        );
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke={filters.type === "income" ? "#06b6d4" : "#3b82f6"}
                      strokeWidth={3}
                      dot={{ r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-40 flex items-center justify-center text-gray-400">
                  No data yet to display chart.
                </div>
              )}
            </div>

            {/* Results list */}
            <div className="rounded-xl p-5 bg-white/40 dark:bg-gray-800/60 backdrop-blur-lg shadow-lg border border-cyan-400/20 overflow-hidden">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">
                Filtered Transactions
              </h3>
              {results.length > 0 ? (
                <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {results.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/20 dark:bg-gray-700/40 hover:bg-cyan-500/10 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-cyan-500/20">
                          <span className="text-lg">{item.icon || "💰"}</span>
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {formatDate(item.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-cyan-400 whitespace-nowrap">
                        {filters.type === "income" ? "+" : "-"}$
                        {Number(item.amount || 0).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400">No transactions yet.</div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Filter;
