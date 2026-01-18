import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  LuClock,
  LuUsers,
  LuFlame,
  LuMessageSquare,
  LuShare2,
} from "react-icons/lu";
import Bookmark from "../ui/Bookmark";
import LikeButton from "../ui/LikeButton";
import MoreOptions from "../ui/MoreOptions";
import ShareDialog from "../ui/ShareDialog";
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
  isLiked,
  likeCount: initialLikeCount,
  user,
}) {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0);

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

  const handleCommentClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/recipe/${id}`, { state: { scrollToComments: true } });
  };

  const handleShareClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/recipe/${id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this amazing recipe: ${title}`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        console.log("Error sharing:", err);
      }
    }
    setShowShareDialog(true);
  };

  const effectiveIsLiked = isLiked !== undefined ? isLiked : favourite;

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
              <LuClock className="w-4 h-4" />
              <span>{prepTime + cookTime}m</span>
            </div>
            <div className="flex items-center gap-1.5">
              <LuUsers className="w-4 h-4" />
              <span>{servings} servings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <LuFlame className="w-4 h-4" />
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
              <LikeButton
                recipeId={id}
                initialLiked={effectiveIsLiked}
                size="medium"
                className="flex items-center gap-2 hover:text-blue-600 transition-colors group text-gray-600"
                onLike={(liked, count) => setLikeCount(count)}
              >
                <span className="text-sm font-medium text-gray-600">
                  {likeCount > 0 ? likeCount : "Like"}
                </span>
              </LikeButton>

              {/* Comment Button */}
              <button
                onClick={handleCommentClick}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors group"
              >
                <LuMessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Comment</span>
              </button>

              {/* Share Button */}
              <button
                onClick={handleShareClick}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors group"
              >
                <LuShare2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
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

      {/* Share Dialog */}
      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        url={`${window.location.origin}/recipe/${id}`}
        title={title}
      />
    </>
  );
}

export default RecipeCard;
