import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import ProfileSetup from "./pages/SignUp/ProfileSetup";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import CreateRecipe from "./pages/CreateRecipe/CreateRecipe";
import EditRecipe from "./pages/EditRecipe/EditRecipe";
import RecipeDetail from "./pages/RecipeDetail/RecipeDetail";
import Settings from "./pages/Settings/Settings";
import UserProfile from "./pages/UserProfile/UserProfile";
import SearchResults from "./pages/SearchResults/SearchResults";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/route/ProtectedRoute";

const router = createBrowserRouter([
  { path: "/landing-page", element: <LandingPage /> },
  { path: "/signin", element: <SignIn /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/profile-setup", element: <ProfileSetup /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/", element: <Dashboard /> },
          { path: "/create", element: <CreateRecipe /> },
          { path: "/edit/:id", element: <EditRecipe /> },
          { path: "/recipe/:id", element: <RecipeDetail /> },
          { path: "/settings", element: <Settings /> },
          { path: "/profile/:id", element: <UserProfile /> },
          { path: "/search", element: <SearchResults /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
