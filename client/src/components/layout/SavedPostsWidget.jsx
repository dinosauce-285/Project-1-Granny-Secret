import { useState, useEffect } from "react";
import api from "../../api/api";

function SavedPostsWidget({ onViewAll }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const res = await api.get("/recipes", {
          params: { saved: true },
        });
        setRecipes(res.data.data || []);
      } catch (error) {
        console.error("Error fetching saved recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedRecipes();
  }, []);

  if (loading) return null;

  return (
    <div className="rounded-xl shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Saved Recipes</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          View All
        </button>
      </div>
      <div className="space-y-3">
        {recipes.length > 0 ? (
          recipes.slice(0, 3).map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => (window.location.href = `/recipe/${recipe.id}`)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer transition-all hover:shadow-sm"
              role="button"
              tabIndex={0}
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={recipe.imageUrl || "/placeholder-recipe.jpg"}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">
                  {recipe.title}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  by {recipe.user?.fullName || recipe.user?.username}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic px-2">
            No saved recipes yet
          </p>
        )}
      </div>
    </div>
  );
}

export default SavedPostsWidget;
