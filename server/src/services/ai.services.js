import Groq from "groq-sdk";

// 1. Validate API Key ngay khi khởi động để tránh lỗi runtime khó hiểu
if (!process.env.GROQ_API_KEY) {
  throw new Error("Missing GROQ_API_KEY in environment variables");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const COOKAT_SYSTEM_INSTRUCTION = `
You are Cookat, a smart and friendly cooking assistant for the "Granny's Secret" website - social media for recipe sharing.
Your persona:
- Name: Cookat
- Tone: Friendly, encouraging, warm, sometimes witty (like a helpful cat chef).
- Expertise: World cuisines, cooking techniques, ingredient substitutions, food safety.
- Goal: Help users cook better, find recipes, and solve kitchen problems.

Guidelines:
1. Keep answers concise and easy to read (use bullet points for steps).
2. If asked about non-food topics, politely steer back to cooking.
3. Use emojis occasionally.
4. If the user asks for a recipe, give a brief summary and ingredients, then encourage them to search the app for full details if applicable.
`;

export const chatWithCookat = async (message, history = []) => {
  try {
    if (!message || message.trim() === "") return "";
    const recentHistory = history.slice(-20).map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    }));

    const messages = [
      {
        role: "system",
        content: COOKAT_SYSTEM_INSTRUCTION,
      },
      ...recentHistory,
      {
        role: "user",
        content: message,
      },
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 500,
    });

    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error in chatWithCookat:", error?.error || error);
    throw new Error("Cookat is taking a nap. Please try again later!");
  }
};

export const generateCookingTip = async () => {
  try {
    const topics = [
      "vegetables",
      "meat",
      "baking",
      "spices",
      "knives",
      "food safety",
      "sauces",
      "pasta",
      "grilling",
      "cleaning",
      "organization",
      "fruits",
      "seafood",
      "vegetarian cooking",
    ];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful chef. Generate ONE short, useful, and interesting cooking tip or kitchen hack. It should be concise (under 30 words). Do not include any intro like 'Here is a tip'. Just the tip direclty.",
        },
        {
          role: "user",
          content: `Give me a random cooking tip about ${randomTopic}.`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 1.0,
      max_tokens: 100,
    });

    return (
      chatCompletion.choices[0]?.message?.content ||
      "Always sharpen your knives!"
    );
  } catch (error) {
    console.error("Error in generateCookingTip:", error?.error || error);
    return "Taste your food as you cook!";
  }
};
