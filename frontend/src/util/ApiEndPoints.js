export const baseUrl = "https://budgetit-qft3.onrender.com/api/v1.0";
export const CLOUDINARY_CLOUD_NAME = "dfnj9sbrz"
export const CLOUDINARY_CLOUD_UNSIGNED_PRESET = "Budgetit"

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
    // Cloudinary
    UPLOAD_IMAGE: "https://api.cloudinary.com/v1_1/dfnj9sbrz/image/upload" 
};
