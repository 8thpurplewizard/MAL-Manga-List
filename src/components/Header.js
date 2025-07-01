import React from "react";

const Header = ({ theme, toggleTheme }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-4xl font-bold text-red-200">MAL Manga Status</h1>
      <button
        onClick={toggleTheme}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-200 ${
          theme === "light"
            ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
            : "bg-gray-600 text-red-200 hover:bg-gray-500"
        }`}
      >
        Toggle Theme ({theme === "light" ? "Dark" : "Light"})
      </button>
    </div>
  );
};

export default Header;
