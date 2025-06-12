import React, { useState, useEffect } from "react";
import axios from "axios";

// Main React App component
function App() {
  // State to store the extracted manga data (including title, score, chapters, volumes)
  const [mangaData, setMangaData] = useState([]);
  // State to store the status of the API request/data processing
  const [status, setStatus] = useState("Click 'Fetch Manga List' to load.");
  // State to manage loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // Function to parse the HTML snippet and extract manga details
  const parseMangaData = (rawHtmlSnippet) => {
    console.log("Raw HTML Snippet received:", rawHtmlSnippet); // Log the raw HTML snippet for debugging

    // Using regex to extract the 'data-items' attribute value
    const dataItemsMatch = rawHtmlSnippet.match(/data-items="([^"]*)"/);

    if (dataItemsMatch && dataItemsMatch[1]) {
      let jsonString = dataItemsMatch[1];

      // Replace HTML entities for double quotes (&quot;) with actual double quotes (")
      jsonString = jsonString.replace(/&quot;/g, '"');

      console.log("Cleaned JSON String for parsing:", jsonString); // Log the cleaned JSON string

      try {
        // Attempt to parse the cleaned JSON string into a JavaScript array of objects
        const parsedManga = JSON.parse(jsonString);
        console.log("Parsed Manga Data Object:", parsedManga); // Log the parsed manga data object

        // Extract required details from each item in the array
        const extractedData = parsedManga.map((item) => ({
          title: item.manga_title,
          score: item.manga_score,
          chapters: item.manga_num_chapters,
          volumes: item.manga_num_volumes,
        }));
        console.log("Extracted Manga Details:", extractedData); // Log the extracted details

        return extractedData; // Return the array of manga detail objects
      } catch (error) {
        console.error("Error parsing JSON data from 'data-items':", error);
        // Return an empty array on parsing error to prevent the app from crashing
        return [];
      }
    }
    console.log("No 'data-items' attribute found in the HTML snippet.");
    // Return an empty array if data-items attribute is not found
    return [];
  };

  // Function to handle the API call
  const fetchMangaList = async () => {
    setIsLoading(true); // Set loading state to true
    setStatus("Fetching manga list..."); // Update status message
    setMangaData([]); // Clear previous data

    try {
      // The axios call to fetch data from the API endpoint
      const response = await axios.get("/api/mangalist/FancyUnicorn?status=6");
      setStatus(`Success: ${response.status}`);
      console.log("API Response Data (full):", response.data);
      const data = parseMangaData(response.data);
      setMangaData(data);
    } catch (error) {
      console.error("Error fetching manga list:", error);
      setStatus(`Error: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // useEffect is now empty, meaning the API call will only happen when the button is clicked.
  useEffect(() => {
    // This useEffect hook is now only for initial setup if needed,
    // the API call is triggered by the button click.
  }, []); // Empty dependency array ensures this effect runs only once after the initial render

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">
          MAL Manga Status
        </h1>
        <p className="text-center text-gray-600 mb-4">
          Status: <span className="font-semibold text-gray-800">{status}</span>
        </p>

        <button
          onClick={fetchMangaList}
          disabled={isLoading} // Disable button while loading
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Loading..." : "Fetch Manga List"}
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 border-b pb-2">
          Manga List:
        </h2>
        {mangaData.length > 0 ? (
          <ul className="space-y-4">
            {mangaData.map((manga, index) => (
              <li
                key={index}
                className="bg-blue-50 p-4 rounded-md shadow-sm border border-blue-200"
              >
                <span className="font-bold text-lg text-blue-800 block mb-1">
                  {manga.title}
                </span>
                <span className="text-gray-700 text-sm">
                  Score:{" "}
                  <span className="font-medium text-green-700">
                    {manga.score || "N/A"}
                  </span>{" "}
                  | Chapters:{" "}
                  <span className="font-medium text-purple-700">
                    {manga.chapters || "N/A"}
                  </span>{" "}
                  | Volumes:{" "}
                  <span className="font-medium text-orange-700">
                    {manga.volumes || "N/A"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 mt-4">
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
