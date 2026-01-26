import api from "./api";

// Get user profile
export const getUserProfile = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

// Get user's recipes
export const getUserRecipes = async (userId) => {
  const response = await api.get(`/users/${userId}/recipes`);
  return response.data;
};

// Check if current user is following a user
export const checkFollowStatus = async (userId) => {
  const response = await api.get(`/users/${userId}/is-following`);
  return response.data;
};

// Toggle follow/unfollow a user
export const toggleFollow = async (userId) => {
  const response = await api.post(`/users/${userId}/follow`);
  return response.data;
};

// Update user profile
export const updateUserProfile = async (data) => {
  const response = await api.put("/users/me", data);
  return response.data;
};