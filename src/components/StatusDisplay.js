import React from "react";

const StatusDisplay = ({ theme, status }) => {
  return (
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
  );
};

export default StatusDisplay;
