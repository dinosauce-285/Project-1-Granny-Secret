import FilterSection from "../../components/filters/FilterSection";
import RecipeCard from "../../components/recipe/RecipeCard";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api.js";
function Dashboard() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true);
        const res = await api.get("/recipes");
        setRecipes(res.data.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Error fetching recipes"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  if (error)
    return (
      <div className="text-red-500 p-5 text-center">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()} className="underline">
          Try again
        </button>
      </div>
    );

  if (loading) return <p className="text-center p-10">Loading recipes...</p>;

  return (
    <div className="w-full pb-4">
      <FilterSection />
      {recipes.map((r) => (
        <Link to={`/recipe/${r.id}`}>
          <div className="recipes w-full sm:w-[95%] mx-auto px-3 sm:px-0">
            <RecipeCard key={r.id} {...r} />
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Dashboard;
