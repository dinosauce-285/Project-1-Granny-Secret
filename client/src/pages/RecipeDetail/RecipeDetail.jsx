import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import Heart from "../../components/ui/Heart";
import MoreOptions from "../../components/ui/MoreOptions";
import Dialog from "../../components/ui/Dialog";

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEditClick = () => {
    navigate(`/edit/${id}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/recipes/${id}`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await api.get(`/recipes/${id}`);
        setRecipe(res.data.data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Error fetching recipes"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const renderSpiciness = (level) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < level ? "text-red-500" : "text-gray-300"}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>
      </span>
    ));
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

  if (loading) return <p className="text-center p-10">Loading recipe...</p>;
  return (
    <>
      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete Recipe"
        message={`Are you sure you want to delete "${recipe.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmStyle="danger"
        onConfirm={handleConfirmDelete}
      />
      <div className="w-[95%] mx-auto pb-8">
        <div className="relative max-h-[600px] rounded-2xl overflow-hidden shadow-2xl mb-8 flex items-center justify-center bg-black">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-auto object-cover mx-auto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Heart
              recipeId={recipe.id}
              initialFavourite={recipe.favourite}
              size="large"
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 hover:scale-110"
            />
            <MoreOptions
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              size="large"
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 hover:scale-110 text-white"
            />
          </div>
          <button
            onClick={() => window.history.back()}
            className="absolute top-4 left-4 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="white"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </button>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-olive text-white text-sm rounded-full">
                {recipe.category?.name}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-inter">
              {recipe.title}
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl px-4 py-9 shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-gray-500 text-sm">Prep Time</div>
            <div className="font-semibold text-lg">{recipe.prepTime} mins</div>
          </div>
          <div className="bg-white rounded-xl px-4 py-9 shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-gray-500 text-sm">Cook Time</div>
            <div className="font-semibold text-lg">{recipe.cookTime} mins</div>
          </div>
          <div className="bg-white rounded-xl px-4 py-9 shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-gray-500 text-sm">Servings</div>
            <div className="font-semibold text-lg">
              {recipe.servings} people
            </div>
          </div>
          <div className="bg-white rounded-xl px-4 py-9  shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-gray-500 text-sm">Difficulty</div>
            <div className="font-semibold text-lg">{recipe.difficulty}</div>
          </div>
          <div className="bg-white rounded-xl px-4 py-9  shadow-md text-center hover:shadow-lg transition-shadow col-span-2 md:col-span-1">
            <div className="text-gray-500 text-sm">Spiciness</div>
            <div className="font-semibold flex justify-center py-1">
              {renderSpiciness(recipe.spiciness)}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 w-full">
          <div className="w-full">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-2xl font-bold mb-4 font-inter flex items-center gap-2">
                Ingredients
              </h2>
              <ul className="space-y-3">
                {recipe.ingredients?.map((ing, idx) => (
                  <li
                    key={ing.id || idx}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-olive focus:ring-olive cursor-pointer"
                    />
                    <span className="flex-1">
                      <span className="font-medium">{ing.name}</span>
                      <span className="text-gray-500 ml-2">
                        {ing.amount} {ing.unit}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-full">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-2xl font-bold mb-6 font-inter flex items-center gap-2">
                Cooking Steps
              </h2>
              <div className="space-y-6">
                {recipe.steps?.map((step, idx) => (
                  <div key={step.id || idx} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-olive to-primary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
                      {step.stepOrder}
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {step.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {recipe.note && (
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 shadow-md mt-8 border border-amber-200">
                <h2 className="text-xl font-bold mb-3 font-inter flex items-center gap-2">
                  Notes
                </h2>
                <p className="text-gray-700 italic leading-relaxed">
                  "{recipe.note}"
                </p>
              </div>
            )}
            {/* Date Info */}
            <div className="text-gray-400 text-sm mt-6 text-right">
              Saved on {new Date(recipe.createdAt).toLocaleDateString("en-US")}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecipeDetail;
