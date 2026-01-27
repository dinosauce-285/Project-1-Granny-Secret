import { useState, useEffect, useCallback } from "react";
import { LuInbox } from "react-icons/lu";
import { useSearchParams, useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import { LuPlus } from "react-icons/lu";
import RecipeCard from "../../components/recipe/RecipeCard";
import LeftSidebar from "../../components/layout/LeftSidebar";
import RightSidebar from "../../components/layout/RightSidebar";
import FilterSection from "../../components/filters/FilterSection";
import Loader from "../../components/ui/Loader";
import MobileDrawer from "../../components/ui/MobileDrawer";
import { getRecipes, getMyRecipes, searchRecipes } from "../../api/recipe.api";

function Dashboard() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useOutletContext();

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

      if (filter.search) {
        const res = await searchRecipes(filter.search);
        setRecipes(res.data.recipes || []);
        setLoading(false);
        return;
      }

      if (filter.type === "my-recipes") {
        const res = await getMyRecipes();
        setRecipes(res.data || []);
      } else {
        const params = {};
        if (filter.type === "category" && filter.categoryId) {
          params.category = filter.categoryId;
        } else if (filter.type === "favourite") {
          params.favourite = true;
        }
        const res = await getRecipes(params);
        setRecipes(res.data || []);
      }
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
      {/* Mobile Drawer for Filters */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title="Menu"
      >
        {/* Create Recipe Button - Mobile only */}
        <Link
          to="/create"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 mb-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium shadow-sm"
        >
          <LuPlus className="w-5 h-5" />
          Create Recipe
        </Link>

        <LeftSidebar
          onFilterChange={(filter) => {
            handleFilterChange(filter);
            setIsMobileMenuOpen(false);
          }}
          activeFilter={activeFilter}
          isMobile={true}
        />
      </MobileDrawer>

      {/* Left Sidebar - Filters (Desktop) */}
      <LeftSidebar
        onFilterChange={handleFilterChange}
        activeFilter={activeFilter}
      />

      {/* Main Feed */}
      <div className="flex-1 min-w-0 h-full overflow-y-auto pb-4">
        {/* Recipe Feed */}
        <div className="max-w-2xl mx-auto px-2 sm:px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader />
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
