import FilterSection from "../../components/filters/FilterSection";
import RecipeCard from "../../components/recipe/RecipeCard";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api.js";

function Dashboard() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ type: "all" });

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);

      let url = "/recipes/my-recipes";
      if (filter.type === "category" && filter.categoryId) {
        url += `?category=${filter.categoryId}`;
      } else if (filter.type === "favourite") {
        url += `?favourite=true`;
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
    setFilter(newFilter);
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
    <div className="w-full pb-4">
      <FilterSection onFilterChange={handleFilterChange} />
      {loading ? (
        <p className="text-center p-10">Loading recipes...</p>
      ) : recipes.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No recipes found</p>
      ) : (
        recipes.map((r) => (
          <Link to={`/recipe/${r.id}`} key={r.id}>
            <div className="recipes w-full sm:w-[95%] mx-auto px-3 sm:px-0">
              <RecipeCard {...r} />
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

export default Dashboard;
