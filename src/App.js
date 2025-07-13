import React, { useEffect } from "react";

import Header from "./components/Header";
import StatusDisplay from "./components/StatusDisplay";
import FetchButton from "./components/FetchButton";
import MangaStats from "./components/MangaStats";
import SortControls from "./components/SortControls";
import MangaList from "./components/MangaList";

import useMangaData from "./hooks/useMangaData";
import useSortableData from "./hooks/useSortableData";
import useMangaStatistics from "./hooks/useMangaStatistics";

import { ThemeProvider, useTheme } from "./context/ThemeContext";

function App() {
  const { mangaData, status, isLoading, fetchMangaList, setMangaData } =
    useMangaData();
  const { sortedData, sortBy, sortOrder, handleSort, setSortBy, setSortOrder } =
    useSortableData(mangaData);
  const { mangaUserStatusCounts, mangaStatusCounts, mangaGenreCounts } =
    useMangaStatistics(mangaData);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Reset sort when fetching new data
    setSortBy(null);
    setSortOrder("asc");
  }, [mangaData, setSortBy, setSortOrder]);

  const renderSortIcon = (key) => {
    if (sortBy === key) {
      return sortOrder === "asc" ? " ▲" : " ▼";
    }
    return "";
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
          mangaList={mangaData}
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
          sortedManga={sortedData}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

export default AppWrapper;
