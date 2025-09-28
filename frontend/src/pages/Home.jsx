import NavbarHome from "../components/NavbarHome.jsx";
import Footer from "../components/Footer.jsx";
import { assets } from "../assets/assets.js";
import budgetitSS2 from "../assets/budgetit ss 2.png";
import budgetitSS2white from "../assets/budgetit ss 2 white.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <NavbarHome />
      <main className="flex flex-col min-h-[calc(100vh-64px)] bg-gradient-to-br from-gray-100 via-purple-100 to-white dark:from-gray-900 dark:via-purple-900 dark:to-black transition-colors duration-500">

        {/* Hero Section */}
        <section
          id="home"
          className="relative z-10 flex flex-col items-center justify-center py-12 sm:py-20 px-4 text-center"
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/2 w-[300px] sm:w-[500px] md:w-[600px] h-[300px] sm:h-[500px] md:h-[600px] bg-purple-500 opacity-20 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>

          <img
            src={assets.logo}
            alt="BudgetIt Logo"
            className="w-14 h-14 sm:w-20 sm:h-20 mb-6 drop-shadow-lg"
          />
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white">
            BudgetIt
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-md sm:max-w-xl mx-auto mb-8 text-gray-700 dark:text-gray-300">
            Take control of your finances with intuitive expense tracking,
            visual analytics, and smart budgeting tools.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-purple-400 via-purple-600 to-purple-400 dark:from-purple-500 dark:via-purple-700 dark:to-purple-500 text-white font-semibold px-6 sm:px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-300"
          >
            Get Started
          </button>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 px-4 max-w-6xl mx-auto w-full">
          {[
            {
              title: "Smart Tracking",
              description:
                "Easily track income and expenses with emoji icons and custom categories.",
              icon: "📊",
            },
            {
              title: "Visual Analytics",
              description:
                "Beautiful charts and graphs to visualize your spending patterns and financial health.",
              icon: "📈",
            },
            {
              title: "Advanced Filtering",
              description:
                "Filter transactions by date, type, and keywords to analyze your financial data.",
              icon: "🔍",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-purple-500/30 dark:border-purple-400/40 hover:border-purple-400 dark:hover:border-purple-300 transition-all duration-300 text-center"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h2 className="text-lg sm:text-xl font-bold text-purple-500 dark:text-purple-400 mb-2">
                {feature.title}
              </h2>
              <p className="text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </section>

        {/* How It Works */}
        <section className="mt-12 sm:mt-16 px-4 max-w-5xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-500 dark:text-purple-400 mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Add Transactions",
                description:
                  "Quickly add income and expenses with emoji icons and categories",
              },
              {
                step: "2",
                title: "Track & Analyze",
                description:
                  "Monitor your spending with real-time charts and financial overview",
              },
              {
                step: "3",
                title: "Filter & Export",
                description:
                  "Filter your data and export insights for better financial decisions",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-white/10 dark:bg-gray-800/20 rounded-xl"
              >
                <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  {item.step}
                </div>
                <h3 className="text-purple-500 dark:text-purple-400 font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="mt-12 sm:mt-16 px-4 max-w-4xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-500 dark:text-purple-400 mb-4">
            Experience Your Financial Dashboard
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm sm:text-base">
            Get a complete overview of your finances with interactive charts,
            transaction history, and real-time balance tracking.
          </p>

          <img
            src={budgetitSS2white}
            alt="Dashboard Preview Light"
            className="rounded-2xl shadow-2xl border-4 border-purple-500/40 w-full max-w-2xl mx-auto object-cover dark:hidden"
          />
          <img
            src={budgetitSS2}
            alt="Dashboard Preview Dark"
            className="rounded-2xl shadow-2xl border-4 border-purple-400/50 w-full max-w-2xl mx-auto object-cover hidden dark:block"
          />
        </section>

        {/* About Us */}
        <section id="about" className="mt-16 px-4 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-500 dark:text-purple-400 mb-4">
            About Us
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg">
            BudgetIt is built with a mission to simplify personal finance
            management. Our team believes in empowering individuals with the
            tools they need to take control of their money and make smarter
            financial decisions.
          </p>
        </section>

        {/* Contact Us */}
        <section id="contact" className="mt-16 px-4 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-500 dark:text-purple-400 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg mb-6">
            Have questions or feedback? We’d love to hear from you.
          </p>
          <form className="space-y-4 max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
            <textarea
              rows="4"
              placeholder="Your Message"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            ></textarea>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-300"
            >
              Send Message
            </button>
          </form>
        </section>

        {/* CTA */}
        <section className="mt-16 mb-12 px-4 max-w-2xl mx-auto text-center">
          <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-purple-500/30">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-500 dark:text-purple-400 mb-4">
              Ready to Take Control?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm sm:text-base">
              Join thousands of users who are already managing their finances
              smarter with BudgetIt.
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-6 sm:px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-300"
            >
              Start Free Today
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer className="bg-white/5 dark:bg-purple-900/30 border-t border-purple-500/30 dark:border-purple-700/40 text-gray-700 dark:text-gray-600 relative z-10 px-4 sm:px-6" />
    </>
  );
};

export default Home;
