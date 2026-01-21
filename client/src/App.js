import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import ProfileSetup from "./pages/SignUp/ProfileSetup";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import CreateRecipe from "./pages/CreateRecipe/CreateRecipe";
import EditRecipe from "./pages/EditRecipe/EditRecipe";
import RecipeDetail from "./pages/RecipeDetail/RecipeDetail";
import Settings from "./pages/Settings/Settings";
import UserProfile from "./pages/UserProfile/UserProfile";
import SearchResults from "./pages/SearchResults/SearchResults";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/route/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateRecipe />} />
            <Route path="/edit/:id" element={<EditRecipe />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile/:id" element={<UserProfile />} />
            <Route path="/search" element={<SearchResults />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
