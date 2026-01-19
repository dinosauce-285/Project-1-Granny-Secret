import { useState, useEffect } from "react";
import api from "../../api/api";

function LikedPostsWidget() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedRecipes = async () => {
      try {
        const res = await api.get("/recipes", {
          params: { favourite: true },
        });
        setRecipes(res.data.data || []);
      } catch (error) {
        console.error("Error fetching liked recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedRecipes();
  }, []);

  if (loading) return null;
  return (
    <div className="rounded-xl shadow-sm p-4 mb-4">
      <h3 className="font-semibold text-gray-900 mb-3">Liked Recipes</h3>
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
                  {recipe.category?.name || "Uncategorized"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic px-2">
            No liked recipes yet
          </p>
        )}
      </div>
    </div>
  );
}

export default LikedPostsWidget;
