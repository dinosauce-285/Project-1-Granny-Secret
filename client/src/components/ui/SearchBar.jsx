import { useState, useEffect, useRef } from "react";
import { LuSearch, LuLoader, LuX } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import api from "../../api/api.js";

function SearchBar({ initialValue = "", onSearch }) {
  const [value, setValue] = useState(initialValue);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const debounceTimer = useRef(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults(null);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
      setResults(res.data.data);
      setShowDropdown(true);
    } catch (error) {
      console.error("Search error:", error);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      performSearch(newValue);
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setShowDropdown(false);
      if (value.trim()) {
        navigate(`/search?q=${encodeURIComponent(value)}`);
      }
    }
  };

  const handleRecipeClick = (recipeId) => {
    setShowDropdown(false);
    setValue("");
    navigate(`/recipe/${recipeId}`);
  };

  const handleUserClick = (userId) => {
    setShowDropdown(false);
    setValue("");
    navigate(`/user/${userId}`);
  };

  const clearSearch = () => {
    setValue("");
    setResults(null);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const hasResults =
    results && (results.recipes?.length > 0 || results.users?.length > 0);

  return (
    <div className="searchBar w-full rounded-full relative" ref={dropdownRef}>
      <div className="flex items-center border border-gray-300 rounded-full transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus-within:bg-white focus-within:border-olive focus-within:shadow-sm">
        <LuSearch className="w-5 h-5 text-gray-500 ml-4" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search recipes, users, ingredients..."
          className="flex-1 min-w-0 px-3 py-2.5 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm"
        />
        {loading && (
          <LuLoader className="w-5 h-5 text-gray-400 mr-3 animate-spin" />
        )}
        {!loading && value && (
          <button
            onClick={clearSearch}
            className="mr-3 p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <LuX className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          {!hasResults && !loading && value && (
            <div className="p-4 text-center text-gray-500">
              No results found
            </div>
          )}

          {hasResults && (
            <div className="py-2">
              {/* Users */}
              {results.users?.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                    Users ({results.users.length})
                  </div>
                  {results.users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserClick(user.id)}
                      className="w-full px-4 py-2 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <img
                        src={user.avatarUrl || "/sampleAva.jpg"}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-gray-900">
                          {user.fullName || user.username}
                        </div>
                        <div className="text-xs text-gray-500">
                          @{user.username} · {user.recipesCount} recipes
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Recipes */}
              {results.recipes?.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                    Recipes ({results.recipes.length})
                  </div>
                  {results.recipes.map((recipe) => (
                    <button
                      key={recipe.id}
                      onClick={() => handleRecipeClick(recipe.id)}
                      className="w-full px-4 py-2 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <img
                        src={recipe.imageUrl || "/placeholder-recipe.jpg"}
                        alt={recipe.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-gray-900">
                          {recipe.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          by {recipe.user?.username || "Unknown"}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
