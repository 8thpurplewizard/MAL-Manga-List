import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Header from "./components/Header";
import StatusDisplay from "./components/StatusDisplay";
import FetchButton from "./components/FetchButton";
import MangaStats from "./components/MangaStats";
import SortControls from "./components/SortControls";
import MangaList from "./components/MangaList";

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

  const getUserStatus = (statusNum) => {
    switch (statusNum) {
      case 1:
        return "Reading";
      case 2:
        return "Read";
      case 3:
        return "On-Hold";
      case 4:
        return "Dropped";
      case 6:
        return "To-read";
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
          userStatus: getUserStatus(item.status),
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
      const response = await axios.get("/api/mangalist/FancyUnicorn?status=7");
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

  const mangaUserStatusCounts = useMemo(() => {
    const counts = {};
    mangaData.forEach((manga) => {
      counts[manga.userStatus] = (counts[manga.userStatus] || 0) + 1;
    });
    return counts;
  }, [mangaData]);

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
        <Header theme={theme} toggleTheme={toggleTheme} />
        <StatusDisplay theme={theme} status={status} />
        <FetchButton isLoading={isLoading} fetchMangaList={fetchMangaList} />
        <MangaStats
          theme={theme}
          mangaUserStatusCounts={mangaUserStatusCounts}
          mangaStatusCounts={mangaStatusCounts}
          mangaGenreCounts={mangaGenreCounts}
          isLoading={isLoading}
        />
        {mangaData.length > 0 && (
          <SortControls
            sortBy={sortBy}
            handleSort={handleSort}
            renderSortIcon={renderSortIcon}
          />
        )}
        <MangaList
          theme={theme}
          sortedManga={sortedManga}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default App;
