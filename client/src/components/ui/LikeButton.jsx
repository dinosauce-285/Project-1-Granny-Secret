import { useState, useEffect } from "react";
import { RiThumbUpLine, RiThumbUpFill } from "react-icons/ri";
import api from "../../api/api";

function LikeButton({
  recipeId,
  initialLiked,
  size = "default",
  className = "",
  children,
  onLike,
}) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsLiked(initialLiked);
  }, [initialLiked]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const previousLiked = isLiked;
    setIsLiked(!previousLiked);

    if (!previousLiked) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }

    try {
      const res = await api.patch(`/recipes/${recipeId}/${previousLiked ? "unfavourite" : "favourite"}`);
      const { isLiked: apiLiked, likeCount: apiCount } = res.data.data;
      setIsLiked(apiLiked);
      if (onLike) onLike(apiLiked, apiCount);
    } catch (error) {
      setIsLiked(previousLiked);
    }
  };

  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-5 h-5 sm:w-6 sm:h-6",
    medium: "w-6 h-6",
    large: "w-7 h-7 sm:w-8 sm:h-8",
  };

  const iconSize = sizeClasses[size] || sizeClasses.default;

  return (
    <button
      onClick={handleToggle}
      className={`relative flex items-center justify-center active:scale-95 transition-transform duration-100 overflow-visible ${className}`}
    >
      <div
        className={`relative origin-center ${
          isAnimating 
            ? "animate-[jump-pop_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]" 
            : ""
        }`}
      >
        {isLiked ? (
          <RiThumbUpFill className={`${iconSize} text-blue-600`} />
        ) : (
          <RiThumbUpLine className={`${iconSize} text-gray-500 hover:text-blue-500 transition-colors duration-200`} />
        )}
      </div>

      {children}

      <style jsx>{`
        @keyframes jump-pop {
          0% { transform: scale(1) translateY(0) rotate(0deg); }
          50% { transform: scale(1.4) translateY(-15px) rotate(-15deg);}
          100% { transform: scale(1) translateY(0) rotate(0deg); }
        }
      `}</style>
    </button>
  );
}

export default LikeButton;