import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import CreateRecipe from "./pages/CreateRecipe/CreateRecipe";
import RecipeDetail from "./pages/RecipeDetail/RecipeDetail";
import MainLayout from "./components/layout/MainLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateRecipe />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
