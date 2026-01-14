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

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/dashboard?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="fixed inset-0 flex flex-row pt-2 px-2 sm:px-0 overflow-hidden bg-page">
      <div className="navBar w-16 sm:w-20 lg:w-[5%] h-full ml-1  sm:ml-3 flex flex-col flex-shrink-0 items-center">
        <Link to="/dashboard">
          <div className="logoWrapper h-[6vh] sm:h-[8vh] min-h-[48px] flex items-center justify-center">
            <img src="/logo.webp" alt="" className="h-full max-h-16" />
          </div>
        </Link>
        <div className="icons mt-auto mb-auto flex flex-col space-y-4 sm:space-y-6 lg:space-y-8 ">
          <Link to="/dashboard">
            <div className="hover:bg-olive/30 hover:scale-110 p-2 sm:p-3 rounded-md transition-all duration-300">
              <svg
                className="w-8 h-8 "
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            </div>
          </Link>
          <Link to="/create">
            <div className="hover:bg-olive/30 hover:scale-110 p-2 sm:p-3 rounded-md transition-all duration-300">
              <svg
                className="w-8 h-8"
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
            </div>
          </Link>
        </div>
      </div>

      <div className="mainContent ml-2 sm:ml-3 mr-2 sm:mr-4 lg:mr-8 flex-1 min-w-0 flex flex-col overflow-hidden">
        <div className="header w-full mb-3 sm:mb-4 min-h-[8vh] flex flex-col sm:flex-row items-center flex-shrink-0">
          <SearchBar initialValue={currentSearch} onSearch={handleSearch} />
          <div className="flex flex-row items-center gap-4 sm:gap-6 lg:gap-8 ">
            <div className="w-9 h-9 sm:w-10 sm:h-10 cursor-pointer flex rounded-lg items-center justify-center hover:bg-white transition-all duration-300`">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5 sm:w-6 sm:h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </div>

            <div className="avatar border border-white border-2 shadow-xl hover:border-olive hover:border-[2.5px] transition-all duration-300 w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden cursor-pointer">
              <img
                src={avatarUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-4 sm:pb-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
export default MainLayout;
