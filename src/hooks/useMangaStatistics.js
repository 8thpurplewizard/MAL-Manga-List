import { useMemo } from "react";

const useMangaStatistics = (mangaData) => {
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

  return { mangaUserStatusCounts, mangaStatusCounts, mangaGenreCounts };
};

export default useMangaStatistics;
