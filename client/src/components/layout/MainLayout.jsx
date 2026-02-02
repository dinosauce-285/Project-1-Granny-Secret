import { useState, useRef, useEffect } from "react";
import { LuCirclePlus, LuSearch, LuPlus } from "react-icons/lu";
import { Link, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from "../ui/SearchBar";
import { supabase } from "../../supabaseClient";
import NotificationDropdown from "../notification/NotificationDropdown";
import HamburgerButton from "../ui/HamburgerButton";
import MobileDrawer from "../ui/MobileDrawer";
import LeftSidebar from "./LeftSidebar";

const defaultAvatar = "/avatars/sampleAvatar.jpg";

function MainLayout() {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const avatarUrl = user?.avatarUrl ? user.avatarUrl : defaultAvatar;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSearch = searchParams.get("search") || "";
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
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

  const handleFilterChange = (filter) => {
    setIsMobileMenuOpen(false);

    if (filter.type === "all") {
      navigate("/");
    } else if (filter.type === "favourite") {
      navigate("/?filter=favourite");
    } else if (filter.type === "my-recipes") {
      navigate("/?filter=my-recipes");
    } else if (filter.type === "saved") {
      navigate("/?filter=saved");
    } else if (filter.type === "category") {
      navigate(`/?category=${filter.categoryId}`);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-page">
      {/* Top Header */}
      <div className="header w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 min-h-[8vh] flex flex-row items-center justify-between lg:justify-normal gap-4 sm:gap-6 flex-shrink-0 border-b border-gray-100 bg-white/80 backdrop-blur-sm shadow-sm z-50 relative">
        {/* Left Group: Hamburger + Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <HamburgerButton
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />

          {/* Logo - Hidden when search is expanded on mobile */}
          <Link
            to="/"
            className={`flex-shrink-0 transition-all duration-300 ${
              isSearchExpanded ? "hidden" : "flex"
            }`}
          >
            <img
              src="/logo.webp"
              alt="Grany Secret"
              className="h-8 sm:h-10 lg:h-12 w-auto"
            />
          </Link>
        </div>

        {/* Right Group: Search + Notification + Desktop(Create + Avatar) */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 lg:flex-1">
          {/* Search Bar - Expandable on mobile */}
          <div
            ref={searchRef}
            className={`transition-all duration-300 ${
              isSearchExpanded ? "flex-1 min-w-0" : "lg:flex-1 lg:min-w-0"
            }`}
          >
            {/* Search Icon Button - Mobile only */}
            {!isSearchExpanded && (
              <button
                onClick={() => setIsSearchExpanded(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation"
                aria-label="Search"
              >
                <LuSearch className="w-5 h-5 text-gray-600" />
              </button>
            )}

            {/* Search Bar - Always visible on desktop, expandable on mobile */}
            <div
              className={`${isSearchExpanded ? "block" : "hidden lg:block"}`}
            >
              <SearchBar initialValue={currentSearch} onSearch={handleSearch} />
            </div>
          </div>

          {/* Notification - Always visible */}
          <NotificationDropdown />

          {/* Desktop Only: Create Button */}
          <Link
            to="/create"
            className="hidden lg:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium"
          >
            <LuCirclePlus className="w-5 h-5" />
            <span>Create Recipe</span>
          </Link>

          {/* Desktop Only: Avatar Dropdown */}
          <div
            className="hidden lg:block relative flex-shrink-0"
            ref={dropdownRef}
          >
            <div
              className="avatar border border-white border-2 shadow-xl hover:border-olive hover:border-[2.5px] transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden cursor-pointer"
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
                  onClick={async () => {
                    await supabase.auth.signOut();
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

      {/* Mobile Drawer for Navigation */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title="Menu"
      >
        <Link
          to="/create"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 mb-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium shadow-sm"
        >
          <LuPlus className="w-5 h-5" />
          Create Recipe
        </Link>
        <LeftSidebar
          onFilterChange={handleFilterChange}
          activeFilter={null}
          isMobile={true}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </MobileDrawer>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <Outlet
          context={{
            isMobileMenuOpen,
            setIsMobileMenuOpen,
          }}
        />
      </div>
    </div>
  );
}
export default MainLayout;
