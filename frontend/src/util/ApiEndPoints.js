export const baseUrl = import.meta.env.VITE_API_BASE_URL;
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_CLOUD_UNSIGNED_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

export const ApiEndPoints = {
  login: "/profile/login",
  register: "/profile/register",
  activate: "/activate",
  authCheck: "/profile/getProfile",
  dashboard: "/dashboard",
  // Categories
  categories: "/categories",
  categoryByType: (type) => `/categories/${type}`,
  updateCategory: (id) => `/categories/${id}`,
  // Incomes
  incomes: "/incomes",
  deleteIncome: (incomeId) => `/incomes?incomeId=${incomeId}`,
  // Expenses
  expenses: "/expenses",
  deleteExpense: (expenseId) => `/expenses?expenseId=${expenseId}`,
  // Filters
  filters: "/filters/filter",
  // Cloudinary
  UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`
};
