import React from "react";

const MangaList = ({ theme, sortedManga, isLoading }) => {
  return (
    <>
      <h2
        className={`text-center text-2xl font-semibold ${
          theme === "light"
            ? "text-gray-800 mt-8 mb-4 border-b pb-2"
            : "text-gray-200 mt-8 mb-4 border-b pb-2"
        } `}
      >
        Manga List:
      </h2>

      {sortedManga.length > 0 ? (
        <ul className="space-y-4">
          {sortedManga.map((manga, index) => (
            <li
              key={index}
              className={`p-4 rounded-md shadow-sm border ${
                theme === "light" ? "border-blue-200" : "border-blue-600"
              } ${index % 2 === 0 ? "bg-custom-light" : "bg-custom-dark"}`}
            >
              <span
                className={`font-bold text-lg block mb-1 ${
                  theme === "light" ? "text-blue-800" : "text-blue-200"
                }`}
              >
                {manga.title}
              </span>
              <span
                className={`${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                } text-sm`}
              >
                Score:{" "}
                <span className="font-medium text-red-200">
                  {manga.score !== null ? manga.score : "N/A"}
                </span>{" "}
                | Chapters:{" "}
                <span className="font-medium text-red-200">
                  {manga.chapters !== null ? manga.chapters : "N/A"}
                </span>{" "}
                | Volumes:{" "}
                <span className="font-medium text-red-200">
                  {manga.volumes !== null ? manga.volumes : "N/A"}
                </span>{" "}
                | Status:{" "}
                <span className="font-medium text-red-200">
                  {manga.publishingStatus}
                </span>
                {manga.genres && manga.genres.length > 0 && (
                  <>
                    {" "}
                    | Genres:{" "}
                    <span className="font-medium text-red-200">
                      {manga.genres.join(", ")}
                    </span>
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p
          className={`${
            theme === "light" ? "text-gray-500" : "text-gray-400"
          } text-center mt-4`}
        >
          {isLoading
            ? "Please wait..."
            : "No manga data loaded yet. Click 'Fetch Manga List' to begin."}
        </p>
      )}
    </>
  );
};

export default MangaList;
