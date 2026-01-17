import { useState } from "react";
import { LuBookmark } from "react-icons/lu";
import api from "../../api/api";

function Bookmark({
  recipeId,
  initialFavourite,
  size = "default",
  className = "",
}) {
  const [isFavourite, setIsFavourite] = useState(initialFavourite);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isFavourite) {
        await api.patch(`/recipes/${recipeId}/unfavourite`);
      } else {
        await api.patch(`/recipes/${recipeId}/favourite`);
      }
      setIsFavourite(!isFavourite);
    } catch (error) {
      console.error("Error toggling favourite:", error);
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
      title={isFavourite ? "Remove from saved" : "Save recipe"}
    >
      <LuBookmark
        className={`${sizeClasses[size] || sizeClasses.default} ${
          isFavourite ? "text-amber-500" : "text-gray-600"
        }`}
        fill={isFavourite ? "#F59E0B" : "none"}
        stroke={isFavourite ? "#F59E0B" : "currentColor"}
      />
    </button>
  );
}

export default Bookmark;
