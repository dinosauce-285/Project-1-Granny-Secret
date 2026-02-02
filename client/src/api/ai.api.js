import api from "./api";

export const chatWithCookat = (message, history) => {
  return api.post("/ai/chat", { message, history });
};
