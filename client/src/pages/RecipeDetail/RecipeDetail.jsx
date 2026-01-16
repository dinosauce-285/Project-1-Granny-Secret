import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import Heart from "../../components/ui/Heart";
import Bookmark from "../../components/ui/Bookmark";
import MoreOptions from "../../components/ui/MoreOptions";
import Dialog from "../../components/ui/Dialog";

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const defaultAvatar = "/avatars/sampleAvatar.jpg";
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const handleEditClick = () => {
    navigate(`/edit/${id}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/recipes/${id}`);
      navigate("/");
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const handleFollowToggle = async () => {
    if (!user) {
      navigate("/signin");
      return;
    }
    if (user.id === recipe.user.id) {
      return;
    }

    try {
      const res = await api.post(`/users/${recipe.user.id}/follow`);
      setIsFollowing(res.data.data.isFollowing);
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
    setShowShareDialog(false);
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      // TODO: Implement comment API
      // const res = await api.post(`/recipes/${id}/comments`, { content: newComment });
      setComments([
        ...comments,
        {
          id: Date.now(),
          content: newComment,
          user: { fullName: "You" },
          createdAt: new Date(),
        },
      ]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await api.get(`/recipes/${id}`);
        const recipeData = res.data.data;
        setRecipe(recipeData);

        // Fetch follow status if user is logged in and not the owner
        if (user && recipeData.userId && user.id !== recipeData.userId) {
          try {
            const followRes = await api.get(
              `/users/${recipeData.userId}/is-following`
            );
            setIsFollowing(followRes.data.data.isFollowing);
          } catch (followError) {
            console.error("Error checking follow status:", followError);
          }
        }

        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Error fetching recipes"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id, user]);

  const renderSpiciness = (level) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < level ? "text-red-500" : "text-gray-300"}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>
      </span>
    ));
  };
  if (error)
    return (
      <div className="text-red-500 p-5 text-center">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()} className="underline">
          Try again
        </button>
      </div>
    );

  if (loading) return <p className="text-center p-10">Loading recipe...</p>;
  return (
    <>
      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete Recipe"
        message={`Are you sure you want to delete "${recipe.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmStyle="danger"
        onConfirm={handleConfirmDelete}
      />
      <div className="w-[95%] max-w-4xl mx-auto pb-8 pt-4">
        <div className="relative max-h-[600px] rounded-2xl overflow-hidden shadow-2xl mb-8 flex items-center justify-center bg-black mt-4">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-auto object-cover mx-auto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Heart
              recipeId={recipe.id}
              initialFavourite={recipe.favourite}
              size="large"
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 hover:scale-110"
            />
            <Bookmark
              recipeId={recipe.id}
              initialBookmark={recipe.bookmarked}
              size="large"
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 hover:scale-110"
            />
            <button
              onClick={handleShare}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 hover:scale-110 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="white"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                />
              </svg>
            </button>
            {user &&
              recipe.user &&
              (user.id === recipe.user.id ||
                String(user.id) === String(recipe.user.id)) && (
                <MoreOptions
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  size="large"
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 hover:scale-110 text-white"
                />
              )}
          </div>
          <button
            onClick={() => window.history.back()}
            className="absolute top-4 left-4 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="white"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </button>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-primary text-white text-sm rounded-full">
                {recipe.category?.name}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-inter">
              {recipe.title}
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl px-4 py-9 shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-gray-500 text-sm">Prep Time</div>
            <div className="font-semibold text-lg">{recipe.prepTime} mins</div>
          </div>
          <div className="bg-white rounded-xl px-4 py-9 shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-gray-500 text-sm">Cook Time</div>
            <div className="font-semibold text-lg">{recipe.cookTime} mins</div>
          </div>
          <div className="bg-white rounded-xl px-4 py-9 shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-gray-500 text-sm">Servings</div>
            <div className="font-semibold text-lg">
              {recipe.servings} people
            </div>
          </div>
          <div className="bg-white rounded-xl px-4 py-9  shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-gray-500 text-sm">Difficulty</div>
            <div className="font-semibold text-lg">{recipe.difficulty}</div>
          </div>
          <div className="bg-white rounded-xl px-4 py-9  shadow-md text-center hover:shadow-lg transition-shadow col-span-2 md:col-span-1">
            <div className="text-gray-500 text-sm">Spiciness</div>
            <div className="font-semibold flex justify-center py-1">
              {renderSpiciness(recipe.spiciness)}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 w-full">
          <div className="w-full">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-2xl font-bold mb-4 font-inter flex items-center gap-2">
                Ingredients
              </h2>
              <ul className="space-y-3">
                {recipe.ingredients?.map((ing, idx) => (
                  <li
                    key={ing.id || idx}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-olive focus:ring-olive cursor-pointer"
                    />
                    <span className="flex-1">
                      <span className="font-medium">{ing.name}</span>
                      <span className="text-gray-500 ml-2">
                        {ing.amount} {ing.unit}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-full">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-2xl font-bold mb-6 font-inter flex items-center gap-2">
                Cooking Steps
              </h2>
              <div className="space-y-6">
                {recipe.steps?.map((step, idx) => (
                  <div key={step.id || idx} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-olive to-primary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
                      {step.stepOrder}
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {step.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {recipe.note && (
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 shadow-md mt-8 border border-amber-200">
                <h2 className="text-xl font-bold mb-3 font-inter flex items-center gap-2">
                  Notes
                </h2>
                <p className="text-gray-700 italic leading-relaxed">
                  "{recipe.note}"
                </p>
              </div>
            )}
            {/* Date Info */}
            <div className="text-gray-400 text-sm mt-6 text-right">
              Saved on {new Date(recipe.createdAt).toLocaleDateString("en-US")}
            </div>
          </div>
        </div>

        {/* Author Section */}
        <div className="bg-white rounded-2xl p-6 shadow-md mt-8">
          <h3 className="text-lg font-semibold mb-4">Recipe by</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                <img
                  src={recipe.user?.avatarUrl || defaultAvatar}
                  alt={recipe.user?.fullName || recipe.user?.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-lg">
                  {recipe.user?.fullName ||
                    recipe.user?.username ||
                    "Anonymous"}
                </h4>
                <p className="text-gray-500 text-sm">
                  @{recipe.user?.username || "user"}
                </p>
              </div>
            </div>
            <button
              onClick={handleFollowToggle}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                isFollowing
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl p-6 shadow-md mt-8">
          <h3 className="text-xl font-semibold mb-4">
            Comments ({comments.length})
          </h3>

          {/* Add Comment */}
          <div className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts or ask a question..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows="3"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handlePostComment}
                disabled={!newComment.trim()}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                Post Comment
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex gap-3 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                    <img
                      src={comment.user?.avatarUrl || defaultAvatar}
                      alt={comment.user?.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {comment.user?.fullName || "User"}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <svg
                  className="w-16 h-16 mx-auto text-gray-300 mb-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                  />
                </svg>
                <p className="text-gray-500">No comments yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        title="Share Recipe"
        message="Share this recipe with your friends!"
        confirmText="Copy Link"
        cancelText="Close"
        onConfirm={handleCopyLink}
      />
    </>
  );
}

export default RecipeDetail;
