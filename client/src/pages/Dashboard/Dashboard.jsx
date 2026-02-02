import { useState, useEffect, useCallback } from "react";
import { LuInbox } from "react-icons/lu";
import { useSearchParams, useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import { LuPlus } from "react-icons/lu";
import RecipeCard from "../../components/recipe/RecipeCard";
import LeftSidebar from "../../components/layout/LeftSidebar";
import RightSidebar from "../../components/layout/RightSidebar";
import Loader from "../../components/ui/Loader";
import MobileDrawer from "../../components/ui/MobileDrawer";
import { getRecipes, getMyRecipes, searchRecipes } from "../../api/recipe.api";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";

function Dashboard() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useOutletContext();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [filter, setFilter] = useState({
    type: "all",
    search: searchParams.get("search") || "",
  });

  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const search = searchParams.get("search");
    const filterType = searchParams.get("filter");
    const categoryId = searchParams.get("category");

    if (search) {
      setFilter((prev) => ({ ...prev, type: "search", search }));
      setPage(1);
      setRecipes([]);
    } else if (filterType === "favourite") {
      setFilter({ type: "favourite" });
      setActiveFilter("favourites");
      setPage(1);
      setRecipes([]);
    } else if (filterType === "my-recipes") {
      setFilter({ type: "my-recipes" });
      setActiveFilter("my-recipes");
      setPage(1);
      setRecipes([]);
    } else if (filterType === "saved") {
      setFilter({ type: "saved" });
      setActiveFilter("saved");
      setPage(1);
      setRecipes([]);
    } else if (categoryId) {
      setFilter({ type: "category", categoryId });
      setActiveFilter(categoryId);
      setPage(1);
      setRecipes([]);
    } else {
      setFilter((prev) => ({ ...prev, search: "", type: "all" }));
      setActiveFilter("all");
    }
  }, [searchParams]);

  const fetchRecipes = useCallback(async () => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setIsFetching(true);
      }

      let resData = [];
      const limit = 10;
      const params = { page, limit };

      if (filter.search) {
        const res = await searchRecipes(filter.search);
        resData = res.data.recipes || [];
        setHasMore(false);
      } else if (filter.type === "my-recipes") {
        const res = await getMyRecipes({ ...params });
        resData = res.data || [];
        setHasMore(resData.length === limit);
      } else {
        if (filter.type === "category" && filter.categoryId) {
          params.category = filter.categoryId;
        } else if (filter.type === "favourite") {
          params.favourite = true;
        } else if (filter.type === "saved") {
          params.saved = true;
        }
        const res = await getRecipes(params);
        resData = res.data || [];
        setHasMore(resData.length === limit);
      }

      setRecipes((prev) => {
        if (page === 1) return resData;

        const existingIds = new Set(prev.map((r) => r.id));
        const newRecipes = resData.filter((r) => !existingIds.has(r.id));
        return [...prev, ...newRecipes];
      });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Error fetching recipes",
      );
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [filter, page]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleFilterChange = (newFilter) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
    setPage(1);
    setHasMore(true);

    if (newFilter.type === "all") {
      setActiveFilter("all");
    } else if (newFilter.type === "favourite") {
      setActiveFilter("favourites");
    } else if (newFilter.type === "saved") {
      setActiveFilter("saved");
    } else if (newFilter.type === "my-recipes") {
      setActiveFilter("my-recipes");
    } else if (newFilter.type === "category") {
      setActiveFilter(newFilter.categoryId);
    }
  };

  const handleLoadMore = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const lastRecipeElementRef = useInfiniteScroll(
    isFetching,
    hasMore,
    handleLoadMore,
  );

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
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </MobileDrawer>

      {/* Left Sidebar - Filters (Desktop) */}
      <LeftSidebar
        onFilterChange={handleFilterChange}
        activeFilter={activeFilter}
      />

      {/* Main Feed */}
      <div className="flex-1 min-w-0 h-full overflow-y-auto pb-4 custom-scrollbar">
        <div className="max-w-2xl mx-auto px-2 sm:px-4">
          {page === 1 && loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader />
            </div>
          ) : recipes.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <LuInbox className="w-20 h-20 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">No recipes found</p>
              <p className="text-gray-400 text-sm">
                Try adjusting your filters or create a new recipe!
              </p>
            </div>
          ) : (
            <>
              {recipes.map((r, index) => {
                if (recipes.length === index + 1) {
                  return (
                    <div ref={lastRecipeElementRef} key={r.id}>
                      <RecipeCard {...r} />
                    </div>
                  );
                } else {
                  return <RecipeCard key={r.id} {...r} />;
                }
              })}

              {/* Loader for next page */}
              {isFetching && page > 1 && (
                <div className="flex justify-center py-4">
                  <Loader />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Sidebar - Trending/Suggestions */}
      <RightSidebar onFilterChange={handleFilterChange} />
    </div>
  );
}

export default Dashboard;
