import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

// Main React App component
function App() {
  // State to manage the current theme ('light' or 'dark')
  const [theme, setTheme] = useState("dark");
  // State to store the extracted manga data
  const [mangaData, setMangaData] = useState([]);
  // State to store the status of the API request/data processing
  const [status, setStatus] = useState("Click 'Fetch Manga List' to load.");
  // State to manage loading indicator
  const [isLoading, setIsLoading] = useState(false);
  // State for sorting: 'title', 'score', 'chapters', 'volumes', 'publishingStatus'
  const [sortBy, setSortBy] = useState(null);
  // State for sort order: 'asc' or 'desc'
  const [sortOrder, setSortOrder] = useState("asc");

  // Helper function to map numerical status to readable string
  const getPublishingStatus = (statusNum) => {
    switch (statusNum) {
      case 1:
        return "Publishing";
      case 2:
        return "Completed";
      case 4:
        return "Hiatus";
      default:
        return "N/A";
    }
  };

  // Function to parse the HTML snippet and extract manga details
  const parseMangaData = (rawHtmlSnippet) => {
    console.log("Raw HTML Snippet received:", rawHtmlSnippet);

    const dataItemsMatch = rawHtmlSnippet.match(/data-items="([^"]*)"/);

    if (dataItemsMatch && dataItemsMatch[1]) {
      let jsonString = dataItemsMatch[1];
      jsonString = jsonString.replace(/&quot;/g, '"');
      console.log("Cleaned JSON String for parsing:", jsonString);

      try {
        const parsedManga = JSON.parse(jsonString);
        console.log("Parsed Manga Data Object:", parsedManga);

        const extractedData = parsedManga.map((item) => ({
          title: item.manga_title,
          score: item.manga_score_val ? parseFloat(item.manga_score_val) : null, // Parse score to number
          chapters: item.manga_num_chapters
            ? parseInt(item.manga_num_chapters, 10)
            : null, // Parse chapters to number
          volumes: item.manga_num_volumes
            ? parseInt(item.manga_num_volumes, 10)
            : null, // Parse volumes to number
          publishingStatus: getPublishingStatus(item.manga_publishing_status),
          // Correctly accessing 'name' from each genre object within the 'genres' array
          genres: item.genres ? item.genres.map((genre) => genre.name) : [],
        }));
        console.log("Extracted Manga Details:", extractedData);
        return extractedData;
      } catch (error) {
        console.error("Error parsing JSON data from 'data-items':", error);
        return [];
      }
    }
    console.log("No 'data-items' attribute found in the HTML snippet.");
    return [];
  };

  // Function to handle the API call
  const fetchMangaList = async () => {
    setIsLoading(true);
    setStatus("Fetching manga list...");
    setMangaData([]);
    setSortBy(null); // Reset sort when fetching new data
    setSortOrder("asc");

    try {
      const response = await axios.get("/api/mangalist/FancyUnicorn?status=6");
      setStatus(`Success: ${response.status}`);
      console.log("API Response Data (full):", response.data);
      const data = parseMangaData(response.data);
      setMangaData(data);
    } catch (error) {
      console.error("Error fetching manga list:", error);
      setStatus(`Error: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle sorting when a column header/button is clicked
  const handleSort = (key) => {
    // If clicking the same key, toggle sort order
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If clicking a new key, set it to ascending
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  // Memoized sorted manga data to avoid re-sorting on every render
  const sortedManga = useMemo(() => {
    if (!mangaData.length || !sortBy) {
      return mangaData; // Return original data if no sort criteria or empty
    }

    const sortableData = [...mangaData]; // Create a shallow copy to avoid mutating original state

    sortableData.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      // Handle null/undefined values by treating them as smaller/larger for numerical sorting
      if (typeof aValue === "number" && typeof bValue === "number") {
        if (aValue === null && bValue === null) return 0;
        if (aValue === null) return sortOrder === "asc" ? 1 : -1; // null comes last if asc
        if (bValue === null) return sortOrder === "asc" ? -1 : 1; // null comes last if asc
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      // String comparison for 'title' and 'publishingStatus'
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Fallback for mixed types or unexpected values (treat as equal)
      return 0;
    });

    return sortableData;
  }, [mangaData, sortBy, sortOrder]);

  const mangaStatusCounts = useMemo(() => {
    const counts = {};
    mangaData.forEach((manga) => {
      counts[manga.publishingStatus] =
        (counts[manga.publishingStatus] || 0) + 1;
    });
    return counts;
  }, [mangaData]);

  const mangaGenreCounts = useMemo(() => {
    const counts = {};
    mangaData.forEach((manga) => {
      if (manga.genres && manga.genres.length > 0) {
        manga.genres.forEach((genre) => {
          counts[genre] = (counts[genre] || 0) + 1;
        });
      } else {
        counts["No Genre Specified"] = (counts["No Genre Specified"] || 0) + 1;
      }
    });
    return counts;
  }, [mangaData]);

  useEffect(() => {}, []);

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Helper to render sort icon
  const renderSortIcon = (key) => {
    if (sortBy === key) {
      return sortOrder === "asc" ? " ▲" : " ▼"; // Up arrow for ascending, down for descending
    }
    return ""; // No icon if not sorted by this key
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "light"
          ? "bg-gray-100 text-gray-900"
          : "bg-gray-800 text-pastel"
      } flex flex-col items-center py-10 px-4 font-sans`}
    >
      <div
        className={`${
          theme === "light"
            ? "bg-white text-gray-800"
            : "bg-gray-700 text-red-200"
        } p-8 rounded-lg shadow-xl w-full max-w-2xl`}
      >
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
        <p
          className={`text-center ${
            theme === "light" ? "text-gray-600 mb-4" : "text-red-200 mb-4"
          } `}
        >
          Status:{" "}
          <span
            className={`font-semibold ${
              theme === "light"
                ? "bg-gray-200 text-gray-600 mb-4"
                : "text-red-200 mb-4"
            }`}
          >
            {status}
          </span>
        </p>

        <button
          onClick={fetchMangaList}
          disabled={isLoading}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-red-200 font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          {isLoading ? "Loading..." : "Fetch Manga List"}
        </button>

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

        <h2
          className={`text-center text-2xl font-semibold ${
            theme === "light"
              ? "text-gray-800 mt-8 mb-4 border-b pb-2"
              : "text-gray-200 mt-8 mb-4 border-b pb-2"
          } `}
        >
          Manga List:
        </h2>

        {mangaData.length > 0 && (
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
        )}

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
      </div>
    </div>
  );
}

export default App;
