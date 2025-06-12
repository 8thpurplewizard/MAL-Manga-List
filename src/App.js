import React, { useState, useEffect } from "react";
import axios from "axios";
// Removed: import { parse } from "node-html-parser"; // This library is Node.js-specific and caused compilation issues in the browser environment.

// Main React App component
function App() {
  // State to store the extracted manga titles
  const [mangaTitles, setMangaTitles] = useState([]);
  // State to store the status of the API request/data processing
  const [status, setStatus] = useState("Loading...");

  // useEffect hook to perform data fetching and parsing when the component mounts
  useEffect(() => {
    // Function to parse the HTML snippet and extract manga titles
    const parseMangaData = (rawHtmlSnippet) => {
      console.log("Raw HTML Snippet received:", rawHtmlSnippet); // Log the raw HTML snippet for debugging

      // Using regex to extract the 'data-items' attribute value
      // This is a browser-compatible way to get the specific string needed for parsing.
      const dataItemsMatch = rawHtmlSnippet.match(/data-items="([^"]*)"/);

      if (dataItemsMatch && dataItemsMatch[1]) {
        let jsonString = dataItemsMatch[1];

        // Replace HTML entities for double quotes (&quot;) with actual double quotes (")
        // This is crucial for JSON.parse to correctly interpret the string.
        jsonString = jsonString.replace(/&quot;/g, '"');

        console.log("Cleaned JSON String for parsing:", jsonString); // Log the cleaned JSON string

        try {
          // Attempt to parse the cleaned JSON string into a JavaScript array of objects
          const mangaData = JSON.parse(jsonString);
          console.log("Parsed Manga Data Object:", mangaData); // Log the parsed manga data object

          // Extract 'manga_title' from each item in the array
          const titles = mangaData.map((item) => item.manga_title);
          console.log("Extracted Manga Titles:", titles); // Log the extracted titles

          return titles; // Return the array of titles
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

    // --- Start of change: Simulating API response ---
    // In a real application, you would replace this mockData with an actual API call
    // to a public endpoint that returns the HTML content.
    //const mockHtmlResponse = `<table class="list-table" data-items="[{&quot;id&quot;:154548302,&quot;status&quot;:6,&quot;score&quot;:0,&quot;tags&quot;:&quot;&quot;,&quot;is_rereading&quot;:0,&quot;num_read_chapters&quot;:0,&quot;num_read_volumes&quot;:0,&quot;created_at&quot;:1700480389,&quot;manga_title&quot;:&quot;20th Century Boys&quot;,&quot;manga_english&quot;:&quot;20th Century Boys&quot;,&quot;manga_num_chapters&quot;:249,&quot;manga_num_volumes&quot;:22,&quot;manga_publishing_status&quot;:2,&quot;manga_id&quot;:3,&quot;manga_magazines&quot;:null,&quot;manga_total_members&quot;:291623,&quot;manga_total_scores&quot;:102312,&quot;manga_score_val&quot;:8.93,&quot;manga_score_diff&quot;:-99,&quot;manga_popularity&quot;:24,&quot;genres&quot;:[{&quot;id&quot;:46,&quot;name&quot;:&quot;Award Winning&quot;},{&quot;id&quot;:8,&quot;name&quot;:&quot;Drama&quot;},{&quot;id&quot;:7,&quot;name&quot;:&quot;Mystery&quot;}]},{&quot;id&quot;:154548303,&quot;status&quot;:6,&quot;score&quot;:0,&quot;tags&quot;:&quot;&quot;,&quot;is_rereading&quot;:0,&quot;num_read_chapters&quot;:0,&quot;num_read_volumes&quot;:0,&quot;created_at&quot;:1700480400,&quot;manga_title&quot;:&quot;Monster&quot;,&quot;manga_english&quot;:&quot;Monster&quot;,&quot;manga_num_chapters&quot;:162,&quot;manga_num_volumes&quot;:18,&quot;manga_publishing_status&quot;:2,&quot;manga_id&quot;:1,&quot;manga_magazines&quot;:null,&quot;manga_total_members&quot;:250000,&quot;manga_total_scores&quot;:90000,&quot;manga_score_val&quot;:8.80,&quot;manga_score_diff&quot;:-80,&quot;manga_popularity&quot;:50,&quot;genres&quot;:[{&quot;id&quot;:8,&quot;name&quot;:&quot;Drama&quot;},{&quot;id&quot;:7,&quot;name&quot;:&quot;Mystery&quot;}]}]"></table>`;

    // Simulate the API call success
    // setTimeout(() => {
    //   // Using setTimeout to mimic an async network request
    //   setStatus("Success: Data loaded from mock source");
    //   const titles = parseMangaData(mockHtmlResponse);
    //   setMangaTitles(titles);
    // }, 500); // Small delay to simulate network latency
    // --- End of change: Simulating API response ---

    // The original axios call is commented out as it caused the "Invalid URL" error

    axios
      .get("/api/mangalist/FancyUnicorn?status=6")
      .then((response) => {
        setStatus(`Success: ${response.status}`);
        console.log("API Response Data (full):", response.data);
        const titles = parseMangaData(response.data);
        setMangaTitles(titles);
      })
      .catch((error) => {
        console.error("Error fetching manga list:", error);
        setStatus(`Error: ${error.message}`);
      });
  }, []); // Empty dependency array ensures this effect runs only once after the initial render

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center text-indigo-700">
          MAL Manga Status
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Status:{" "}
          <span className="font-semibold text-indigo-500">{status}</span>
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
          Manga Titles:
        </h2>
        {mangaTitles.length > 0 ? (
          <ul className="list-disc list-inside space-y-2">
            {mangaTitles.map((title, index) => (
              <li key={index} className="text-gray-800 text-lg">
                <span className="font-medium">{title}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">
            No manga titles found or data is loading. Please check the console
            for errors if this persists.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
