import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeForm from "../../components/recipe/RecipeForm";
import Toast from "../../components/ui/Toast";
import api from "../../api/api";

function CreateRecipe() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const handleCreate = async (formData) => {
    try {
      await api.post("/recipes/create", formData);
      setToastMessage("Recipe created successfully!");
      setToastType("success");
      setShowToast(true);
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error("Error creating recipe:", error);
      setToastMessage(
        error.response?.data?.message ||
          "Failed to create recipe. Please try again.",
      );
      setToastType("error");
      setShowToast(true);
    }
  };

  return (
    <>
      <RecipeForm onSubmit={handleCreate} />
      <Toast
        isOpen={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}

export default CreateRecipe;
