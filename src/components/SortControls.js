import React from "react";

const SortControls = ({ sortBy, handleSort, renderSortIcon }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      <button
        onClick={() => handleSort("title")}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-200 ${
          sortBy === "title"
            ? "bg-blue-600 text-white"
            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
        }`}
      >
        Title{renderSortIcon("title")}
      </button>
      <button
        onClick={() => handleSort("score")}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-200 ${
          sortBy === "score"
            ? "bg-blue-600 text-white"
            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
        }`}
      >
        Score{renderSortIcon("score")}
      </button>
      <button
        onClick={() => handleSort("chapters")}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-200 ${
          sortBy === "chapters"
            ? "bg-blue-600 text-white"
            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
        }`}
      >
        Chapters{renderSortIcon("chapters")}
      </button>
      <button
        onClick={() => handleSort("volumes")}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-200 ${
          sortBy === "volumes"
            ? "bg-blue-600 text-white"
            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
        }`}
      >
        Volumes{renderSortIcon("volumes")}
      </button>
      <button
        onClick={() => handleSort("publishingStatus")}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-200 ${
          sortBy === "publishingStatus"
            ? "bg-blue-600 text-white"
            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
        }`}
      >
        Status{renderSortIcon("publishingStatus")}
      </button>
    </div>
  );
};

export default SortControls;
