import cloudinary from "../config/cloudinary.js";
import Image from "../models/image.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const PROMPTS = [
  "A futuristic cyberpunk city at night",
  "A majestic dragon flying over mountains",
  "A peaceful village in anime style",
  "A anime girl with blue hair and a sword",
  "A fantasy castle in clouds"
];

export const dailyImageGenerator = async () => {
  try {
    const randomPrompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];

    const model = genAI.getGenerativeModel({ model: "imagen-3.0" });
    const result = await model.generateContent(randomPrompt);

    const base64Image =
      result.response.candidates[0].content.parts[0].inlineData.data;

    const uploadRes = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64Image}`,
      { folder: "daily_ai_images" }
    );

    await Image.create({
      
      imageUrl: uploadRes.secure_url,
      cloudinaryId: uploadRes.public_id
    });

    console.log(" Daily image generated");

  } catch (err) {
    console.error(" Daily image error:", err.message);
  }
};

export const getAllImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
