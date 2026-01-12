import { useState } from "react";
import api from "../../api/api";

function Heart({
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
    large: "w-7 h-7 sm:w-8 sm:h-8",
  };

  return (
    <button
      onClick={handleToggle}
      className={`transition-all duration-300 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isFavourite ? "red" : "none"}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="red"
        className={sizeClasses[size] || sizeClasses.default}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  );
}

export default Heart;
