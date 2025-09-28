const Footer = ({ className = "" }) => {
  return (
    <footer
      className={`w-full py-3 text-center text-xs relative z-10
      bg-white/5 dark:bg-gray-900/10 backdrop-blur-xl
      border-t border-white/20 dark:border-gray-700/30
      text-gray-600 dark:text-gray-400 shadow-lg transition-colors duration-300 ${className}`}
    >
      <p className="tracking-widest uppercase text-[11px]">
        © {new Date().getFullYear()} Sohair — All Rights Reserved
      </p>

      {/* Futuristic glowing line */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-[2px] rounded-full animate-pulse
        bg-gradient-to-r from-green-400 via-emerald-500 to-green-400`}
      />
    </footer>
  );
};

export default Footer;