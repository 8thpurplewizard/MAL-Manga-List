import React from "react";

function StatusDropdown({ value, options, onChange, theme }) {
  return (
    <div>
        <select 
        className=
          {`font-semibold ${
            theme === "light"
              ? "bg-gray-200 text-gray-600 mb-4"
              : "bg-gray-900 text-red-200 mb-4"
            }`
          }
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          >
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
    </div>
  );
}

export default StatusDropdown;