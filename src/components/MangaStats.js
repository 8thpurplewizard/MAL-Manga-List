import React from "react";

const MangaStats = ({
  theme,
  mangaStatusCounts,
  mangaGenreCounts,
  isLoading,
}) => {
  return (
    <>
      <h2
        className={`text-center text-2xl font-semibold ${
          theme === "light"
            ? "text-gray-800 mt-8 mb-4 border-b pb-2"
            : "text-red-200 mt-8 mb-4 border-b pb-2"
        } `}
      >
        Manga Status Summary:
      </h2>
      {Object.keys(mangaStatusCounts).length > 0 ? (
        <ul
          className={`space-y-3 mb-6 p-4 rounded-md border ${
            theme === "light"
              ? "bg-gray-50 border-gray-200"
              : "bg-gray-600 border-gray-500"
          }`}
        >
          {Object.entries(mangaStatusCounts).map(([status, count]) => (
            <li
              key={status}
              className={`flex justify-between items-center ${
                theme === "light" ? "text-gray-800" : "text-red-200"
              }`}
            >
              <span className="font-semibold">{status}:</span>
              <span className="text-blue-600 font-bold text-xl">{count}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 mt-4 mb-6">
          {isLoading
            ? "Calculating status summary..."
            : "No status data available yet. Fetch manga list first."}
        </p>
      )}

      <h2
        className={`text-center text-2xl font-semibold ${
          theme === "light"
            ? "text-gray-800 mt-8 mb-4 border-b pb-2"
            : "text-red-200 mt-8 mb-4 border-b pb-2"
        } `}
      >
        Manga Genre Summary:
      </h2>
      {Object.keys(mangaGenreCounts).length > 0 ? (
        <ul
          className={`space-y-3 mb-6 p-4 rounded-md border ${
            theme === "light" ? "border-gray-200" : "border-gray-500"
          }`}
        >
          {Object.entries(mangaGenreCounts)
            .sort(([genreA], [genreB]) => genreA.localeCompare(genreB))
            .map(([genre, count], index) => (
              <li
                key={genre}
                className={`flex justify-between items-center ${
                  theme === "light" ? "text-gray-800" : "text-red-200"
                } ${index % 2 === 0 ? "bg-custom-light" : "bg-custom-dark"}`}
              >
                <span className="font-semibold">{genre}:</span>
                <span className="text-purple-600 font-bold text-xl">
                  {count}
                </span>
              </li>
            ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 mt-4 mb-6">
          {isLoading
            ? "Calculating genre summary..."
            : "No genre data available yet. Fetch manga list first."}
        </p>
      )}
    </>
  );
};

export default MangaStats;
