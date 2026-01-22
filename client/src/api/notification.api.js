import api from "./api";

export const getNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await api.put("/notifications/read-all");
  return response.data;
};
