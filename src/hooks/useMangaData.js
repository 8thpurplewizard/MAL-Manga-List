import { useState, useEffect } from "react";
import axios from "axios";
import { getPublishingStatus, getUserStatus } from "../utils/statusMappers";

const useMangaData = () => {
  const [mangaData, setMangaData] = useState([]);
  const [status, setStatus] = useState("Click 'Fetch Manga List' to load.");
  const [isLoading, setIsLoading] = useState(false);

  const parseMangaData = (rawHtmlSnippet) => {
    console.log("Raw HTML Snippet received:", rawHtmlSnippet);

    const dataItemsMatch = rawHtmlSnippet.match(/data-items="([^"]*)"/);
    console.log(dataItemsMatch);

    if (dataItemsMatch && dataItemsMatch[1]) {
      let jsonString = dataItemsMatch[1];
      jsonString = jsonString.replace(/&quot;/g, '"');
      console.log("Cleaned JSON String for parsing:", jsonString);

      try {
        const parsedManga = JSON.parse(jsonString);
        console.log("Parsed Manga Data Object:", parsedManga);

        const extractedData = parsedManga.map((item) => ({
          title: item.manga_title,
          score: item.manga_score_val ? parseFloat(item.manga_score_val) : null,
          chapters: item.manga_num_chapters
            ? parseInt(item.manga_num_chapters, 10)
            : null,
          volumes: item.manga_num_volumes
            ? parseInt(item.manga_num_volumes, 10)
            : null,
          userStatus: getUserStatus(item.status),
          publishingStatus: getPublishingStatus(item.manga_publishing_status),
          genres: item.genres ? item.genres.map((genre) => genre.name) : [],
          my_list_status: { status: getUserStatus(item.status) },
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

  const fetchMangaList = async () => {
    setIsLoading(true);
    setStatus("Fetching manga list...");
    setMangaData([]);

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

  return { mangaData, status, isLoading, fetchMangaList, setMangaData };
};

export default useMangaData;
