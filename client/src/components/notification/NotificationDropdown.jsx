import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../api/api";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../../api/notification.api";
import { EventSourcePolyfill } from "event-source-polyfill";
import { IoNotificationsOutline } from "react-icons/io5";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUserInfo(JSON.parse(userStr));
      fetchNotifications();
    }
  }, []);

  useEffect(() => {
    if (!userInfo) return;

    fetchNotifications();

    const token = localStorage.getItem("token");
    if (!token) return;

    const eventSource = new EventSourcePolyfill(
      `${API_URL}/notifications/stream`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    eventSource.onmessage = (event) => {
      try {
        const newNotification = JSON.parse(event.data);
        console.log("New notification received:", newNotification);
        setNotifications((prev) => [newNotification, ...prev]);
      } catch (error) {
        console.error("Error parsing notification:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [userInfo]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      console.log("Fetching notifications...");
      const res = await getNotifications();
      console.log("Notification API Response:", res);
      if (res.success) {
        setNotifications(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const handleMarkAsRead = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const getNotificationLink = (notification) => {
    if (notification.type === "FOLLOW") {
      return `/profile/${notification.sender.id}`;
    }
    if (notification.type === "LIKE" || notification.type === "COMMENT") {
      return `/recipe/${notification.recipe?.id}`;
    }
    return "#";
  };

  const getNotificationText = (notification) => {
    if (notification.type === "FOLLOW") {
      return "started following you";
    }
    if (notification.type === "LIKE") {
      return `liked your recipe "${notification.recipe?.title}"`;
    }
    if (notification.type === "COMMENT") {
      return `commented on "${notification.recipe?.title}"`;
    }
    return "";
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";

    interval = seconds / 604800;
    if (interval > 1) return Math.floor(interval) + " weeks ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return "just now";
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!userInfo) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <IoNotificationsOutline className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center text-xs font-bold text-white bg-primary rounded-full shadow-md">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 max-w-[90vw] bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="px-4 py-3 bg-white border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-semibold text-white bg-primary rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <IoNotificationsOutline className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  You're all caught up!
                </h3>
                <p className="text-sm text-gray-500 text-center max-w-xs">
                  Check back later for new notifications about your recipes and
                  followers
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <Link
                    key={notification.id}
                    to={getNotificationLink(notification)}
                    onClick={(e) => {
                      if (!notification.read) {
                        handleMarkAsRead(notification.id, e);
                      }
                      setIsOpen(false);
                    }}
                    className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                      !notification.read
                        ? "bg-primary/5 hover:bg-primary/10"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          notification.sender.avatarUrl || "/auth/sampleAva.jpg"
                        }
                        alt={notification.sender.username}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                      {!notification.read && (
                        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug">
                        <span className="font-semibold text-gray-900">
                          {notification.sender.fullName ||
                            notification.sender.username}
                        </span>
                        <span className="text-gray-600 ml-1">
                          {getNotificationText(notification)}
                        </span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">
                          {getTimeAgo(notification.createdAt)}
                        </p>
                        {!notification.read && (
                          <span className="text-xs font-medium text-primary">
                            New
                          </span>
                        )}
                      </div>
                    </div>

                    {!notification.read && (
                      <button
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                        className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-1.5"
                        aria-label="Mark as read"
                        title="Mark as read"
                      />
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
