import { useState, useRef, useEffect } from "react";
import { Link, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from "../ui/SearchBar";

const defaultAvatar = "/avatars/sampleAvatar.jpg";

function MainLayout() {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const avatarUrl = user?.avatarUrl ? user.avatarUrl : defaultAvatar;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSearch = searchParams.get("search") || "";
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-page">
      {/* Top Header */}
      <div className="header w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 min-h-[8vh] flex flex-row items-center gap-4 sm:gap-6 flex-shrink-0 border-b border-gray-100 bg-white/80 backdrop-blur-sm shadow-sm z-50 relative">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img
            src="/logo.webp"
            alt="Grany Secret"
            className="h-10 sm:h-12 w-auto"
          />
        </Link>

        {/* Search Bar */}
        <div className="flex-1">
          <SearchBar initialValue={currentSearch} onSearch={handleSearch} />
        </div>

        {/* User Actions */}
        <div className="flex flex-row items-center gap-3 sm:gap-4 lg:gap-6">
          <Link
            to="/create"
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-olive text-white rounded-lg hover:bg-olive/90 transition-all duration-300 font-medium"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Create Recipe
          </Link>
          <div className="w-9 h-9 sm:w-10 sm:h-10 cursor-pointer flex rounded-lg items-center justify-center hover:bg-gray-100 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 sm:w-6 sm:h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>
          </div>

          <div className="relative" ref={dropdownRef}>
            <div
              className="avatar border border-white border-2 shadow-xl hover:border-olive hover:border-[2.5px] transition-all duration-300 w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img
                src={avatarUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {isDropdownOpen && (
              <div className="absolute z-50 right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.fullName || user?.username || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
                <Link
                  to={`/profile/${user?.id}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/signin");
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
export default MainLayout;
