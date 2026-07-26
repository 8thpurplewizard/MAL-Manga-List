import React from "react";

function StatusDropdown({ value, options, onChange }) {
  return (
    <div className="text-lg">
      <select 
    value={value} 
    onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
      ))}
    </select>
    </div>
  );
}

export default StatusDropdown;