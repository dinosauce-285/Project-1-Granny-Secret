import api from "./api";

// Get comments for a recipe
export const getComments = async (recipeId) => {
  const response = await api.get(`/recipes/${recipeId}/comments`);
  return response.data;
};

// Post a new comment
export const postComment = async (recipeId, content, parentId = null) => {
  const response = await api.post(`/recipes/${recipeId}/comments`, {
    content,
    parentId,
  });
  return response.data;
};

// Update a comment
export const updateComment = async (commentId, content) => {
  const response = await api.put(`/recipes/comments/${commentId}`, { content });
  return response.data;
};

// Delete a comment
export const deleteComment = async (commentId) => {
  const response = await api.delete(`/recipes/comments/${commentId}`);
  return response.data;
};
