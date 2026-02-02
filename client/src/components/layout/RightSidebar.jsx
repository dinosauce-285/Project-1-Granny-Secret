import { useState, useEffect } from "react";
import { LuLightbulb } from "react-icons/lu";
import api from "../../api/api";
import { getCookingTip } from "../../api/ai.api";
import LikedPostsWidget from "./LikedPostsWidget";
import SavedPostsWidget from "./SavedPostsWidget";

function RightSidebar({ onFilterChange }) {
  const [followedUsers, setFollowedUsers] = useState([]);

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        return;
      }
      try {
        const res = await api.get("/users/me/following");
        setFollowedUsers(res.data.data || []);
      } catch (error) {
        console.error("Error fetching followed users:", error);
      }
    };
    fetchFollowedUsers();
  }, []);

  const [cookingTip, setCookingTip] = useState("");
  useEffect(() => {
    const fetchTip = async () => {
      try {
        const res = await getCookingTip();
        setCookingTip(res.data.tip);
      } catch (error) {
        console.error("Error fetching tip:", error);
        setCookingTip("Cooking is love made visible!");
      }
    };
    fetchTip();
  }, []);

  const defaultAvatar = "/avatars/sampleAvatar.jpg";

  return (
    <div className="hidden xl:block w-80 h-full overflow-y-auto sticky top-0 pb-6">
      {/* Cooking Tips */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <LuLightbulb className="w-5 h-5 text-amber-600" />
          Cooking Tip
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed italic">
          "{cookingTip || "Loading..."}"
        </p>
      </div>
      {/* Following */}
      <div className="rounded-xl shadow-sm p-4 mb-4">
        <h3 className="font-semibold text-gray-900 mb-3">Following</h3>
        <div className="space-y-3">
          {followedUsers.length > 0 ? (
            followedUsers.slice(0, 5).map((user) => (
              <div
                key={user.id}
                onClick={() => (window.location.href = `/profile/${user.id}`)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                role="button"
                tabIndex={0}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                  <img
                    src={user.avatarUrl || defaultAvatar}
                    alt={user.fullName || user.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {user.fullName || user.username}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    @{user.username}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic px-2">
              No following yet
            </p>
          )}
        </div>
      </div>

      <LikedPostsWidget
        onViewAll={() => onFilterChange({ type: "favourite" })}
      />
      <SavedPostsWidget onViewAll={() => onFilterChange({ type: "saved" })} />
    </div>
  );
}

export default RightSidebar;
