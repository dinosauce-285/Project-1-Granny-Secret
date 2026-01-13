import { useNavigate } from "react-router-dom";
import RecipeForm from "../../components/recipe/RecipeForm";
import api from "../../api/api";

function CreateRecipe() {
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    try {
      await api.post("/recipes/create", formData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  return <RecipeForm onSubmit={handleCreate} />;
}

export default CreateRecipe;
