import { useState, useEffect } from "react";
import { LuBookmark } from "react-icons/lu";
import { toggleBookmark } from "../../api/recipe.api";

function Bookmark({
  recipeId,
  initialSaved,
  size = "default",
  className = "",
}) {
  const [isSaved, setIsSaved] = useState(initialSaved);

  useEffect(() => {
    setIsSaved(initialSaved);
  }, [initialSaved]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const previousSaved = isSaved;
    setIsSaved(!previousSaved);

    try {
      await toggleBookmark(recipeId, previousSaved);
    } catch (error) {
      console.error("Error toggling save:", error);
      setIsSaved(previousSaved);
    }
  };

  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-5 h-5 sm:w-6 sm:h-6",
    medium: "w-6 h-6",
    large: "w-7 h-7 sm:w-8 sm:h-8",
  };

  return (
    <button
      onClick={handleToggle}
      className={`transition-all duration-300 ${className}`}
      title={isSaved ? "Remove from saved" : "Save recipe"}
    >
      <LuBookmark
        className={`${sizeClasses[size] || sizeClasses.default} ${
          isSaved ? "text-amber-500" : "text-gray-600"
        }`}
        fill={isSaved ? "#F59E0B" : "none"}
        stroke={isSaved ? "#F59E0B" : "currentColor"}
      />
    </button>
  );
}

export default Bookmark;
