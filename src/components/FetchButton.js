import React from "react";

const FetchButton = ({ isLoading, fetchMangaList }) => {
  return (
    <button
      onClick={fetchMangaList}
      disabled={isLoading}
      className="w-full bg-indigo-500 hover:bg-indigo-600 text-red-200 font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
    >
      {isLoading ? "Loading..." : "Fetch Manga List"}
    </button>
  );
};

export default FetchButton;
