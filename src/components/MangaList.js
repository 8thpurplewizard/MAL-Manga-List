import React from "react";

const MangaList = ({ theme, sortedManga, isLoading }) => {
  if (sortedManga.length === 0) {
    return (
      <p
        className={`text-center mt-4 ${
          theme === "light" ? "text-gray-500" : "text-gray-400"
        }`}
      >
        {isLoading
          ? "Please wait..."
          : "No manga data loaded yet. Click 'Fetch Manga List' to begin."}
      </p>
    );
  }

  return (
    <>
      <h2
        className={`text-center text-2xl font-semibold mt-8 mb-4 border-b pb-2 ${
          theme === "light" ? "text-gray-800" : "text-gray-200"
        }`}
      >
        Manga List:
      </h2>

      <div className="space-y-4">
        {sortedManga.map((manga, index) => (
          <div
            key={index}
            className={`flex overflow-hidden rounded-lg border shadow-sm ${
              theme === "light"
                ? "border-blue-200 bg-white"
                : "border-blue-600 bg-gray-900"
            }`}
          >
            <div className="content-center p-2 shrink-0">
              <img
                src={manga.manga_image_path}
                alt={manga.title}
                className=" object-cover"
                width={100} height={100}
              />
            </div>

            <div className="flex w-full flex-col justify-between p-4">
              <div>
                <p
                  className={`mb-2 text-sm uppercase tracking-wide ${
                    theme === "light" ? "text-blue-700" : "text-blue-300"
                  }`}
                >
                  {manga.userStatus}
                </p>

                <h3
                  className={`mb-2 text-xl font-semibold ${
                    theme === "light" ? "text-gray-900" : "text-gray-100"
                  }`}
                >
                  {manga.title}
                </h3>

                <p
                  className={`text-sm ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  Score: {manga.score !== null ? manga.score : "N/A"} | Chapters:{" "}
                  {manga.chapters !== null ? manga.chapters : "N/A"} | Volumes:{" "}
                  {manga.volumes !== null ? manga.volumes : "N/A"} | Status:{" "}
                  {manga.publishingStatus}
                  {manga.genres?.length > 0
                    ? ` | Genres: ${manga.genres.join(", ")}`
                    : ""}
                </p>
              </div>

              <button className="mt-4 w-fit text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100">
                More Info
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MangaList;