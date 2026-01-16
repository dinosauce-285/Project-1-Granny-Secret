import { useState, useEffect, useCallback } from "react";
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
        err.response?.data?.message || err.message || "Error fetching recipes"
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
              <svg
                className="w-20 h-20 text-gray-300 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m7.875 14.25 1.214 1.942a2.25 2.25 0 0 0 1.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 0 1 1.872 1.002l.164.246a2.25 2.25 0 0 0 1.872 1.002h2.092a2.25 2.25 0 0 0 1.872-1.002l.164-.246A2.25 2.25 0 0 1 16.954 9h4.636M2.41 9a2.25 2.25 0 0 0-.16.832V12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 0 1 .382-.632l3.285-3.832a2.25 2.25 0 0 1 1.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0 0 21.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
              <p className="text-gray-500 text-lg mb-2">No recipes found</p>
              <p className="text-gray-400 text-sm">
                Try adjusting your filters or create a new recipe!
              </p>
            </div>
          ) : (
            recipes.map((r) => (
              <Link to={`/recipe/${r.id}`} key={r.id}>
                <RecipeCard {...r} />
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Right Sidebar - Trending/Suggestions */}
      <RightSidebar />
    </div>
  );
}

export default Dashboard;
