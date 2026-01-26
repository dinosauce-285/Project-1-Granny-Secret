import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RecipeForm from "../../components/recipe/RecipeForm";
import Toast from "../../components/ui/Toast";
import api from "../../api/api";

function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

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
          err.response?.data?.message || err.message || "Error fetching recipe",
        );
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id, navigate]);

  const handleUpdate = async (formData) => {
    try {
      await api.put(`/recipes/${id}`, formData);
      setToastMessage("Recipe updated successfully!");
      setToastType("success");
      setShowToast(true);
      setTimeout(() => navigate(`/recipe/${id}`), 1000);
    } catch (error) {
      console.error("Error updating recipe:", error);
      setToastMessage(
        error.response?.data?.message ||
          "Failed to update recipe. Please try again.",
      );
      setToastType("error");
      setShowToast(true);
    }
  };

  if (loading) return <p className="text-center p-10">Loading recipe...</p>;
  if (error) return <p className="text-center p-10 text-red-500">{error}</p>;

  return (
    <>
      <RecipeForm initialData={recipe} onSubmit={handleUpdate} isEdit />
      <Toast
        isOpen={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}

export default EditRecipe;
