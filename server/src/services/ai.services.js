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

export const generateRecipeDetails = async (prompt) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert chef and an API that strictly returns pure JSON. Do not include markdown codeblocks (\`\`\`json) or any other conversational text. Just the raw JSON object. Use the following schema to answer the user's prompt:
{
  "title": "Recipe Title (string)",
  "prepTime": "preparation time in minutes (number)",
  "cookTime": "cooking time in minutes (number)",
  "servings": "number of servings (number)",
  "spiciness": "spiciness level from 0 to 5 (number)",
  "difficulty": "Easy, Medium, or Hard (string)",
  "category": "category ID from 1 to 11 (string: '1' for Soup/Stew, '2' for Rice Dish, '3' for Noodle Dish, '4' for Salad, '5' for Grilled/Fried Dish, '6' for Stir-fried/Sautéed Dish, '7' for Bakery/Pastry, '8' for Dessert/Sweet, '9' for Drink/Beverage, '10' for Sauce/Dip/Condiment, '11' for Vegetarian/Vegan Dish)",
  "ingredients": [
    {
      "name": "ingredient name (string)",
      "amount": "quantity (string or number)",
      "unit": "measurement unit (string)"
    }
  ],
  "steps": [
    {
      "content": "instruction step (string)"
    }
  ],
  "note": "Any additional tips or serving suggestions (string)"
}`,
        },
        {
          role: "user",
          content: `Please generate a recipe for: ${prompt}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1500,
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || "{}";
    const cleanedContent = responseContent
      .replace(/^\`\`\`json/i, "")
      .replace(/\`\`\`$/i, "")
      .trim();

    return JSON.parse(cleanedContent);
  } catch (error) {
    console.error("Error in generateRecipeDetails:", error?.error || error);
    throw new Error("Failed to generate recipe details. Please try again.");
  }
};
