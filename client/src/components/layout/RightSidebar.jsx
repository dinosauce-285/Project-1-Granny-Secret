import { useState, useEffect } from "react";
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
              <svg
                className="w-12 h-12 mx-auto text-gray-300 mb-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>
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
          <svg
            className="w-5 h-5 text-amber-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
            />
          </svg>
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
