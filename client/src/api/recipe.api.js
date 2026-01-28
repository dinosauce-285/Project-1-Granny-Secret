import api from "./api";

// Get all recipes with optional filters
export const getRecipes = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `/recipes/?${queryString}` : "/recipes/";
  const response = await api.get(url);
  return response.data;
};

// Get current user's recipes
export const getMyRecipes = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `/recipes/my-recipes?${queryString}`
    : "/recipes/my-recipes";
  const response = await api.get(url);
  return response.data;
};

// Search recipes
export const searchRecipes = async (query) => {
  const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

// Get single recipe
export const getRecipe = async (id) => {
  const response = await api.get(`/recipes/${id}`);
  return response.data;
};

// Delete recipe
export const deleteRecipe = async (id) => {
  const response = await api.delete(`/recipes/${id}`);
  return response.data;
};

// Toggle like/unlike (favourite)
export const toggleLike = async (recipeId, isCurrentlyLiked) => {
  const action = isCurrentlyLiked ? "unfavourite" : "favourite";
  const response = await api.patch(`/recipes/${recipeId}/${action}`);
  return response.data;
};

// Toggle bookmark
export const toggleBookmark = async (recipeId, isCurrentlySaved) => {
  const action = isCurrentlySaved ? "unbookmark" : "bookmark";
  const response = await api.patch(`/recipes/${recipeId}/${action}`);
  return response.data;
};
