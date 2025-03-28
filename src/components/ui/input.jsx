import React from "react";

export function Input({ type = "text", value, onChange }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded px-3 py-2 w-full"
    />
  );
}
