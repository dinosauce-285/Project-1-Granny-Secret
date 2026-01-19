import { useState, useEffect, useCallback } from "react";
import { LuInbox } from "react-icons/lu";
import { Link, useSearchParams } from "react-router-dom";
import RecipeCard from "../../components/recipe/RecipeCard";
import LeftSidebar from "../../components/layout/LeftSidebar";
import RightSidebar from "../../components/layout/RightSidebar";
import FilterSection from "../../components/filters/FilterSection";
import api from "../../api/api.js";

function Dashboard() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  const [filter, setFilter] = useState({
    type: "all",
    search: searchParams.get("search") || "",
  });

  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setFilter((prev) => ({ ...prev, type: "search", search }));
    } else {
      setFilter((prev) => ({ ...prev, search: "" }));
    }
  }, [searchParams]);

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);

      let url = "/recipes/";
      const params = [];

      if (filter.type === "category" && filter.categoryId) {
        params.push(`category=${filter.categoryId}`);
      } else if (filter.type === "favourite") {
        params.push(`favourite=true`);
      } else if (filter.type === "my-recipes") {
        url = "/recipes/my-recipes";
      }

      if (filter.search) {
        params.push(`search=${filter.search}`);
      }

      if (params.length > 0) {
        url += "?" + params.join("&");
      }

      const res = await api.get(url);
      setRecipes(res.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Error fetching recipes",
      );
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleFilterChange = (newFilter) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));

    if (newFilter.type === "all") {
      setActiveFilter("all");
    } else if (newFilter.type === "favourite") {
      setActiveFilter("favourites");
    } else if (newFilter.type === "my-recipes") {
      setActiveFilter("my-recipes");
    } else if (newFilter.type === "category") {
      setActiveFilter(newFilter.categoryId);
    }
  };

  if (error)
    return (
      <div className="text-red-500 p-5 text-center">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()} className="underline">
          Try again
        </button>
      </div>
    );

  return (
    <div className="w-full h-full flex gap-4">
      {/* Left Sidebar - Filters */}
      <LeftSidebar
        onFilterChange={handleFilterChange}
        activeFilter={activeFilter}
      />

      {/* Main Feed */}
      <div className="flex-1 min-w-0 h-full overflow-y-auto pb-4">
        {/* Mobile Filter Section */}
        <div className="lg:hidden">
          <FilterSection onFilterChange={handleFilterChange} />
        </div>

        {/* Recipe Feed */}
        <div className="max-w-2xl mx-auto px-2 sm:px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-olive border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500">Loading recipes...</p>
              </div>
            </div>
          ) : recipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <LuInbox className="w-20 h-20 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">No recipes found</p>
              <p className="text-gray-400 text-sm">
                Try adjusting your filters or create a new recipe!
              </p>
            </div>
          ) : (
            recipes.map((r) => <RecipeCard key={r.id} {...r} />)
          )}
        </div>
      </div>

      {/* Right Sidebar - Trending/Suggestions */}
      <RightSidebar />
    </div>
  );
}

export default Dashboard;
