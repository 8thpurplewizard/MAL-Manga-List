import React, { useState } from "react";
import PopUp from "./PopUp";

const MangaStats = ({
  theme,
  mangaUserStatusCounts,
  mangaStatusCounts,
  mangaGenreCounts,
  isLoading,
  mangaList,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
  };

  const handleClosePopUp = () => {
    setSelectedStatus(null);
  };

  const getMangasForStatus = () => {
    if (!selectedStatus) return [];
    return mangaList.filter(
      (manga) => manga.my_list_status.status === selectedStatus
    );
  };
  return (
    <>
      <h2
        className={`text-center text-2xl font-semibold ${
          theme === "light"
            ? "text-gray-800 mt-8 mb-4 border-b pb-2"
            : "text-red-200 mt-8 mb-4 border-b pb-2"
        } `}
      >
        Manga User Status Summary:
      </h2>
      {Object.keys(mangaUserStatusCounts).length > 0 ? (
        <ul
          className={`space-y-3 mb-6 p-4 rounded-md border ${
            theme === "light" ? "border-gray-200" : "border-gray-500"
          }`}
        >
          {Object.entries(mangaUserStatusCounts).map(([status, count]) => (
            <li
              key={status}
              className={`flex justify-between items-center cursor-pointer ${
                theme === "light" ? "text-gray-800" : "text-red-200"
              }`}
              onClick={() => handleStatusClick(status)}
            >
              <span className="font-semibold">{status}:</span>
              <span className="text-purple-600 font-bold text-xl">{count}</span>
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
      {selectedStatus && (
        <PopUp
          mangas={getMangasForStatus()}
          status={selectedStatus}
          onClose={handleClosePopUp}
        />
      )}
    </>
  );
};

export default MangaStats;
