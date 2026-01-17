import { useState, useEffect } from "react";
import { LuSearch } from "react-icons/lu";

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
        <LuSearch className="w-5 h-5 text-gray-500 ml-4" />
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
