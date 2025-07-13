import { useState, useMemo } from "react";

const useSortableData = (data) => {
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!data.length || !sortBy) {
      return data;
    }

    const sortableData = [...data];

    sortableData.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === "number" && typeof bValue === "number") {
        if (aValue === null && bValue === null) return 0;
        if (aValue === null) return sortOrder === "asc" ? 1 : -1;
        if (bValue === null) return sortOrder === "asc" ? -1 : 1;
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    return sortableData;
  }, [data, sortBy, sortOrder]);

  return { sortedData, sortBy, sortOrder, handleSort, setSortBy, setSortOrder };
};

export default useSortableData;
