import api from "./api";

// Get current user (me)
export const getMe = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

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

// Change password
export const changePassword = async (data) => {
  const response = await api.put("/users/me/change-password", data);
  return response.data;
};

// Delete account
export const deleteAccount = async (password) => {
  const response = await api.delete("/users/me", {
    data: { password },
  });
  return response.data;
};
