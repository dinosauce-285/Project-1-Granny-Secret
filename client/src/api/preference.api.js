import api from "./api";

export const getPreferences = async () => {
  const response = await api.get("/preferences");
  return response.data;
};

export const updatePreferences = async (data) => {
  const response = await api.put("/preferences", data);
  return response.data;
};
