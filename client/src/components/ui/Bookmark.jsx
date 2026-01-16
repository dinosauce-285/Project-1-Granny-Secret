import { useState } from "react";
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isFavourite ? "#F59E0B" : "none"}
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke={isFavourite ? "#F59E0B" : "currentColor"}
        className={`${sizeClasses[size] || sizeClasses.default} ${
          isFavourite ? "text-amber-500" : "text-gray-600"
        }`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
        />
      </svg>
    </button>
  );
}

export default Bookmark;
