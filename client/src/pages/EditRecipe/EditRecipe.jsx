import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RecipeForm from "../../components/recipe/RecipeForm";
import api from "../../api/api";

function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await api.get(`/recipes/${id}`);
        const recipeData = res.data.data;
        setRecipe(recipeData);

        const userStr = localStorage.getItem("user");
        const currentUser = userStr ? JSON.parse(userStr) : null;

        if (
          !currentUser ||
          (recipeData.userId && currentUser.id !== recipeData.userId)
        ) {
          navigate("/");
        }

        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Error fetching recipe"
        );
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      await api.put(`/recipes/${id}`, formData);
      navigate(`/recipe/${id}`);
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  if (loading) return <p className="text-center p-10">Loading recipe...</p>;
  if (error) return <p className="text-center p-10 text-red-500">{error}</p>;

  return <RecipeForm initialData={recipe} onSubmit={handleUpdate} isEdit />;
}

export default EditRecipe;
