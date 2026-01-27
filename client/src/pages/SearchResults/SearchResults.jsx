import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { LuInbox, LuSearch } from "react-icons/lu";
import RecipeCard from "../../components/recipe/RecipeCard";
import Loader from "../../components/ui/Loader";
import api from "../../api/api.js";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Error fetching search results",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-5 text-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <LuSearch className="w-20 h-20 text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg mb-2">Enter a search term</p>
        <p className="text-gray-400 text-sm">
          Start typing in the search bar above
        </p>
      </div>
    );
  }

  const hasResults =
    results && (results.recipes?.length > 0 || results.users?.length > 0);

  if (!hasResults) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <LuInbox className="w-20 h-20 text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg mb-2">
          No results found for "{query}"
        </p>
        <p className="text-gray-400 text-sm">
          Try searching with different keywords
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex">
      <div className="flex-1 min-w-0 h-full overflow-y-auto pb-4">
        <div className="max-w-2xl mx-auto px-2 sm:px-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 mt-4">
            Search results for "{query}"
          </h1>

          {/* Users Section */}
          {results.users?.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Users ({results.users.length})
              </h2>
              <div className="space-y-3">
                {results.users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleUserClick(user.id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    <img
                      src={user.avatarUrl || "/sampleAva.jpg"}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {user.fullName || user.username}
                      </p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.recipesCount} recipes
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Recipes Section */}
          {results.recipes?.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Recipes ({results.recipes.length})
              </h2>
              <div className="space-y-4">
                {results.recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} {...recipe} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
