import { useState, useEffect } from "react";
import { LuUsers, LuLightbulb } from "react-icons/lu";
import api from "../../api/api";

function RightSidebar() {
  const [followedUsers, setFollowedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/users/me/following");
        setFollowedUsers(res.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching followed users:", error);
        setLoading(false);
      }
    };
    fetchFollowedUsers();
  }, []);

  const defaultAvatar = "/avatars/sampleAvatar.jpg";

  return (
    <div className="hidden xl:block w-80 h-full overflow-y-auto sticky top-0 pb-6">
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
            <div className="text-center py-6">
              <LuUsers className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No following yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Discover chefs to follow!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cooking Tips */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-sm p-4 border border-amber-100">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <LuLightbulb className="w-5 h-5 text-amber-600" />
          Cooking Tip of the Day
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          "Always taste your food as you cook. Adjust seasonings gradually - you
          can always add more, but you can't take it away!"
        </p>
      </div>
    </div>
  );
}

export default RightSidebar;
