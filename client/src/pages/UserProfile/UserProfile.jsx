import { useState, useEffect } from "react";
import { LuChefHat } from "react-icons/lu";
import { useParams, useNavigate } from "react-router-dom";
import {
  getUserProfile,
  getUserRecipes,
  checkFollowStatus,
  toggleFollow,
} from "../../api/user.api";
import RecipeCard from "../../components/recipe/RecipeCard";
import Toast from "../../components/ui/Toast";

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [stats, setStats] = useState({
    recipesCount: 0,
    followersCount: 0,
    followingCount: 0,
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");

  const currentUserStr = localStorage.getItem("user");
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  const isOwnProfile = currentUser?.id === parseInt(id);
  const defaultAvatar = "/avatars/sampleAvatar.jpg";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);

        const userRes = await getUserProfile(id);
        console.log("User Profile Response:", userRes);
        setUser(userRes.data);
        setStats(userRes.data.stats);

        const recipesRes = await getUserRecipes(id);
        console.log("User Recipes Response:", recipesRes.data);
        setRecipes(recipesRes.data);

        if (!isOwnProfile && currentUser) {
          try {
            const followStatus = await checkFollowStatus(id);
            setIsFollowing(followStatus.data.isFollowing);
          } catch (error) {
            console.error("Error checking follow status:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setToastMessage("Failed to load user profile.");
        setToastType("error");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isOwnProfile]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      navigate("/signin");
      return;
    }
    try {
      const res = await toggleFollow(id);
      const newIsFollowing = res.data.isFollowing;

      setIsFollowing(newIsFollowing);
      setStats((prev) => ({
        ...prev,
        followersCount: newIsFollowing
          ? prev.followersCount + 1
          : prev.followersCount - 1,
      }));
    } catch (error) {
      console.error("Error toggling follow:", error);
      setToastMessage("Failed to update follow status.");
      setToastType("error");
      setShowToast(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">User not found</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-olive text-white rounded-lg hover:bg-olive/90"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-olive/20 flex-shrink-0">
            <img
              src={user.avatarUrl || defaultAvatar}
              alt={user.fullName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {user.fullName || user.username}
            </h1>
            <p className="text-gray-600 mb-3">@{user.username}</p>
            {user.bio && <p className="text-gray-700 mb-4">{user.bio}</p>}

            {/* Stats */}
            <div className="flex gap-6 justify-center md:justify-start mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.recipesCount}
                </p>
                <p className="text-sm text-gray-600">Recipes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.followersCount}
                </p>
                <p className="text-sm text-gray-600">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.followingCount}
                </p>
                <p className="text-sm text-gray-600">Following</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center md:justify-start">
              {isOwnProfile ? (
                <button
                  onClick={() => navigate("/settings")}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    isFollowing
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-olive text-white hover:bg-olive/90"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recipes Section */}
      <div className="max-w-5xl mx-auto px-2 sm:px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 px-2">
          {isOwnProfile ? "My Recipes" : "Recipes"}
        </h2>

        {recipes.length > 0 ? (
          recipes.map((recipe) => <RecipeCard key={recipe.id} {...recipe} />)
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <LuChefHat className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">
              {isOwnProfile
                ? "You haven't created any recipes yet"
                : "This user hasn't created any recipes yet"}
            </p>
            {isOwnProfile && (
              <button
                onClick={() => navigate("/create")}
                className="mt-4 px-6 py-2 bg-olive text-white rounded-lg hover:bg-olive/90 transition-all"
              >
                Create Your First Recipe
              </button>
            )}
          </div>
        )}
      </div>

      <Toast
        isOpen={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default UserProfile;
