import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import AfterLoginNavbar from "../components/AfterLoginNavbar.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import { ApiEndPoints } from "../util/ApiEndPoints.js";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const fmt = (val) => {
  const n = Number(val || 0);
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
};

const dateFmt = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString();
};

const Dashboard = () => {
  const [data, setData] = useState({
    balance: 0,
    totalIncome: 0,
    totalExpense: 0,
    latestTransactions: [],
    last5Incomes: [],
    last5Expenses: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchDashboard = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axiosConfig.get(ApiEndPoints.dashboard);
        if (!mounted) return;
        const resp = res.data || {};

        const last5Incomes = resp.last5Incomes ?? [];
        const last5Expenses = resp.last5Expenses ?? [];
        const latestTransactions = resp.latestTransactions ?? [];

        setData({
          balance:
            resp.balance ?? resp?.balance === 0 ? resp.balance : 0,
          totalIncome: resp.totalIncome ?? 0,
          totalExpense: resp.totalExpense ?? 0,
          latestTransactions,
          last5Incomes,
          last5Expenses,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      mounted = false;
    };
  }, []);

  // Chart data
  let chartData = [
    { name: "Balance", value: Number(data.balance || 0) },
    { name: "Income", value: Number(data.totalIncome || 0) },
    { name: "Expenses", value: Number(data.totalExpense || 0) },
  ];
  const COLORS = ["#06b6d4", "#22c55e", "#ef4444"];

  const allZero = chartData.every((d) => d.value === 0);
  if (allZero) {
    chartData = [{ name: "No Data", value: 1 }];
  }

  const derivedIncomes =
    data.last5Incomes && data.last5Incomes.length > 0
      ? data.last5Incomes
      : (data.latestTransactions || [])
          .filter((t) => (t.type || "").toUpperCase() === "INCOME")
          .slice(0, 5);

  const derivedExpenses =
    data.last5Expenses && data.last5Expenses.length > 0
      ? data.last5Expenses
      : (data.latestTransactions || [])
          .filter((t) => (t.type || "").toUpperCase() === "EXPENSE")
          .slice(0, 5);

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-black dark:text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex">
        <div className="flex-1 overflow-y-auto">
          {/* Navbar */}
          <div className="sticky top-0 z-50">
            <AfterLoginNavbar />
          </div>

          {/* Page content */}
          <div className="p-4 md:p-6 min-h-[calc(100vh-64px)]">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
                Dashboard Overview
              </h1>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm">
                  Fetching your dashboard data...
                </p>
              </div>
            ) : error ? (
              <div className="text-red-400">{error}</div>
            ) : (
              <>
                {/* Stats row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      label: "Total Balance",
                      value: `$${fmt(data.balance)}`,
                      icon: <Wallet className="text-cyan-400" size={28} />,
                    },
                    {
                      label: "Total Income",
                      value: `$${fmt(data.totalIncome)}`,
                      icon: <TrendingUp className="text-green-400" size={28} />,
                    },
                    {
                      label: "Total Expenses",
                      value: `$${fmt(data.totalExpense)}`,
                      icon: <TrendingDown className="text-red-400" size={28} />,
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="relative group rounded-xl p-5 shadow-lg bg-white/5 dark:bg-white/10 backdrop-blur-lg hover:shadow-cyan-500/30 transition transform hover:scale-105"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400">{stat.label}</p>
                          <h2 className="text-2xl font-bold">{stat.value}</h2>
                        </div>
                        {stat.icon}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Transactions + Donut */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  {/* Transactions */}
                  <div className="rounded-xl p-5 bg-white/5 dark:bg-white/10 backdrop-blur-lg shadow-lg hover:shadow-purple-500/30 transition">
                    <h3 className="text-lg font-semibold mb-3 text-cyan-400">
                      Recent Transactions
                    </h3>
                    <div className="max-h-64 overflow-y-auto pr-2">
                      {data.latestTransactions?.length > 0 ? (
                        <ul className="space-y-3">
                          {data.latestTransactions
                            .slice(0, 20)
                            .map((tx) => (
                              <li
                                key={tx.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10">
                                    {tx.type === "INCOME" ? (
                                      <ArrowUpCircle
                                        className="text-green-400"
                                        size={18}
                                      />
                                    ) : (
                                      <ArrowDownCircle
                                        className="text-red-400"
                                        size={18}
                                      />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">
                                      {tx.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {dateFmt(tx.createdAt ?? tx.date)}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-sm font-semibold">
                                  <span
                                    className={
                                      tx.type === "INCOME"
                                        ? "text-green-400"
                                        : "text-red-400"
                                    }
                                  >
                                    {tx.type === "INCOME" ? "+" : "-"}$
                                    {fmt(tx.amount)}
                                  </span>
                                </div>
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400">
                          No recent transactions.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Donut chart */}
                  <div className="rounded-xl p-5 bg-white/5 dark:bg-white/10 backdrop-blur-lg shadow-lg hover:shadow-cyan-500/30 transition flex flex-col items-center relative">
                    <h3 className="text-lg font-semibold mb-3 text-purple-400">
                      Financial Overview
                    </h3>
                    <div className="w-full relative" style={{ height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={95}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {chartData.map((entry, i) => (
                              <Cell
                                key={`c-${i}`}
                                fill={
                                  allZero
                                    ? "#6b7280"
                                    : COLORS[i % COLORS.length]
                                }
                              />
                            ))}
                          </Pie>
                          {!allZero && <Tooltip />}
                          {!allZero && <Legend />}
                        </PieChart>
                      </ResponsiveContainer>

                      {/* Center balance text */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                        <p className="text-xs text-gray-400">Balance</p>
                        <p className="text-xl font-bold text-white">
                          ${fmt(data.balance)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Latest Incomes & Expenses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Incomes */}
                  <div className="rounded-xl p-5 bg-white/5 dark:bg-white/10 backdrop-blur-lg shadow-lg hover:shadow-green-500/30 transition">
                    <h3 className="text-lg font-semibold text-green-400 mb-3">
                      Latest 5 Incomes
                    </h3>
                    <div className="max-h-56 overflow-y-auto pr-2">
                      {derivedIncomes.length > 0 ? (
                        <ul className="space-y-3">
                          {derivedIncomes.slice(0, 5).map((tx) => (
                            <li
                              key={tx.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-green-500/10"
                            >
                              <div className="flex items-center gap-3">
                                <ArrowUpCircle
                                  className="text-green-400"
                                  size={18}
                                />
                                <div>
                                  <p className="text-sm font-medium">
                                    {tx.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {dateFmt(tx.createdAt ?? tx.date)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-sm font-semibold text-green-400">
                                +${fmt(tx.amount)}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400">No incomes yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Expenses */}
                  <div className="rounded-xl p-5 bg-white/5 dark:bg-white/10 backdrop-blur-lg shadow-lg hover:shadow-red-500/30 transition">
                    <h3 className="text-lg font-semibold text-red-400 mb-3">
                      Latest 5 Expenses
                    </h3>
                    <div className="max-h-56 overflow-y-auto pr-2">
                      {derivedExpenses.length > 0 ? (
                        <ul className="space-y-3">
                          {derivedExpenses.slice(0, 5).map((tx) => (
                            <li
                              key={tx.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-red-500/10"
                            >
                              <div className="flex items-center gap-3">
                                <ArrowDownCircle
                                  className="text-red-400"
                                  size={18}
                                />
                                <div>
                                  <p className="text-sm font-medium">
                                    {tx.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {dateFmt(tx.createdAt ?? tx.date)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-sm font-semibold text-red-400">
                                -${fmt(tx.amount)}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400">No expenses yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
