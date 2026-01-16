import { useState, useEffect } from "react";

function SearchBar({ initialValue = "", onSearch }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="searchBar w-full rounded-full">
      <div className="flex items-center border border-gray-300 rounded-full transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus-within:bg-white focus-within:border-olive focus-within:shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5 text-gray-500 ml-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search recipes..."
          className="flex-1 min-w-0 px-3 py-2.5 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm"
        />
      </div>
    </div>
  );
}

export default SearchBar;
