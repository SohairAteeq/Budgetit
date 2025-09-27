import Sidebar from "../components/Sidebar.jsx"
import AfterLoginNavbar from "../components/AfterLoginNavbar.jsx"

const Expense = () => {
    return (
        <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Navbar spans full width */}
        <AfterLoginNavbar />

        {/* Dashboard content */}
        <div className="flex-1 p-5 md:p-7 bg-gray-50 dark:bg-gray-800">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Welcome to Dashboard
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Expense;