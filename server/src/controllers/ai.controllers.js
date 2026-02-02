import * as aiService from "../services/ai.services.js";

export const chat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const reply = await aiService.chatWithCookat(message, history || []);

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
