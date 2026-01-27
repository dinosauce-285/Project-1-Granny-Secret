import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../../api/notification.api";
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

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
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
      return `/profile/${notification.sender.username}`;
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
        className="relative p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Notifications"
      >
        <IoNotificationsOutline className="text-2xl text-gray-700 dark:text-gray-300 transition-transform duration-300 hover:rotate-12" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-red-500 via-pink-500 to-rose-600 rounded-full shadow-lg animate-pulse ring-2 ring-white dark:ring-gray-900">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-[420px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="px-4 py-3 bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-full shadow-md">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[540px] overflow-y-auto overscroll-contain custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="relative mb-4 animate-bounce">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center shadow-lg">
                    <IoNotificationsOutline className="text-3xl text-blue-500 dark:text-blue-400" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center shadow-lg animate-pulse">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">
                  You're all caught up!
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs leading-relaxed">
                  Check back later for new notifications about your recipes and
                  followers
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {notifications.map((notification, index) => (
                  <Link
                    key={notification.id}
                    to={getNotificationLink(notification)}
                    onClick={(e) => {
                      if (!notification.read) {
                        handleMarkAsRead(notification.id, e);
                      }
                      setIsOpen(false);
                    }}
                    className={`group flex items-start gap-3 px-4 py-3 transition-all duration-200 ${
                      !notification.read
                        ? "bg-blue-50/60 dark:bg-blue-900/10 hover:bg-blue-100/60 dark:hover:bg-blue-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          notification.sender.avatarUrl || "/auth/sampleAva.jpg"
                        }
                        alt={notification.sender.username}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700 group-hover:ring-2 transition-all duration-200"
                      />
                      {!notification.read && (
                        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug">
                        <span className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                          {notification.sender.fullName ||
                            notification.sender.username}
                        </span>
                        <span className="text-gray-600 dark:text-gray-300 ml-1">
                          {getNotificationText(notification)}
                        </span>
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {getTimeAgo(notification.createdAt)}
                        </p>
                        {!notification.read && (
                          <span className="px-1.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded">
                            New
                          </span>
                        )}
                      </div>
                    </div>

                    {!notification.read && (
                      <button
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                        className="flex-shrink-0 w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 opacity-70 group-hover:opacity-100 hover:scale-125 transition-all duration-200"
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
