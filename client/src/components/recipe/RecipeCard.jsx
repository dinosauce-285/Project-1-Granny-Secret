import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Bookmark from "../ui/Bookmark";
import MoreOptions from "../ui/MoreOptions";
import Dialog from "../ui/Dialog";
import api from "../../api/api";

const defaultAvatar = "/avatars/sampleAvatar.jpg";

function RecipeCard({
  id,
  imageUrl,
  title,
  createdAt,
  prepTime,
  cookTime,
  servings,
  difficulty,
  category,
  color,
  note,
  favourite,
  user,
}) {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const isOwner =
    currentUser &&
    user &&
    (currentUser.id === user.id || String(currentUser.id) === String(user.id));

  const getTimeAgo = (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return Math.floor(seconds) + " seconds ago";
  };

  const handleEditClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigate(`/edit/${id}`);
  };

  const handleDeleteClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      await api.delete(`/recipes/${id}`);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleCommentClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement comment functionality
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement share functionality
  };

  return (
    <>
      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete Recipe"
        message={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmStyle="danger"
        onConfirm={handleConfirmDelete}
      />

      <div className="w-full bg-white rounded-2xl overflow-hidden shadow-md my-4 sm:my-6 hover:shadow-xl transition-all duration-300">
        {/* Header - User Info */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <Link
            to={`/profile/${user?.id}`}
            className="flex items-center gap-3 rounded-lg p-1 -ml-1 transition-colors group/user"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 group-hover/user:border-primary transition-colors">
              <img
                src={user?.avatarUrl || defaultAvatar}
                alt={user?.fullName || user?.username || "User"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900 text-sm group-hover/user:text-primary transition-colors">
                {user?.fullName || user?.username || "Anonymous"}
              </span>
              <span className="text-xs text-gray-500">
                {getTimeAgo(createdAt)}
              </span>
            </div>
          </Link>
          {isOwner && (
            <MoreOptions
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          )}
        </div>

        {/* Recipe Image */}
        <div className="relative w-full aspect-[16/10] bg-gray-100">
          <img
            className="w-full h-full object-cover"
            src={imageUrl}
            alt={title}
          />
          {category && (
            <div
              style={{ backgroundColor: color || "#8B7355" }}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-white text-xs font-medium shadow-lg backdrop-blur-sm bg-opacity-90"
            >
              {category.name}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-4 py-3">
          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 font-inter">
            {title}
          </h3>

          {/* Recipe Info */}
          <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <span>{prepTime + cookTime}m</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              <span>{servings} servings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
                />
              </svg>
              <span>{difficulty}</span>
            </div>
          </div>

          {/* Note/Description */}
          {note && (
            <p className="text-gray-700 text-sm line-clamp-2 mb-3 font-light italic">
              {note}
            </p>
          )}

          {/* Social Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4">
              {/* Like Button - Thumbs Up */}
              <button
                onClick={handleLikeClick}
                className="flex items-center gap-2 hover:text-blue-600 transition-colors group"
              >
                <svg
                  className={`w-6 h-6 transition-all ${
                    isLiked
                      ? "fill-blue-600 text-blue-600"
                      : "fill-none text-gray-600 group-hover:scale-110"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-600">
                  {likeCount > 0 ? likeCount : "Like"}
                </span>
              </button>

              {/* Comment Button */}
              <button
                onClick={handleCommentClick}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors group"
              >
                <svg
                  className="w-6 h-6 group-hover:scale-110 transition-transform"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                  />
                </svg>
                <span className="text-sm font-medium">Comment</span>
              </button>

              {/* Share Button */}
              <button
                onClick={handleShareClick}
                className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors group"
              >
                <svg
                  className="w-6 h-6 group-hover:scale-110 transition-transform"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                  />
                </svg>
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>

            {/* Bookmark/Save */}
            <div className="flex items-center">
              <Bookmark
                size="medium"
                className="hover:scale-110 transition-transform"
                recipeId={id}
                initialFavourite={favourite}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecipeCard;
