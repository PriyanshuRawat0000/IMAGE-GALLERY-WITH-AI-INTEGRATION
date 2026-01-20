

const { HfInference } = require("../../../Frontend/vite-project/node_modules/@huggingface/inference/dist/commonjs");
const cloudinary = require("../config/cloudinary");
const Image = require("../models/image");

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const PROMPTS = [
  "A futuristic cyberpunk city at night",
  "A majestic dragon flying over mountains",
  "A peaceful village in anime style",
  "A anime girl with blue hair and a sword",
  "A fantasy castle in clouds"
];

const dailyImageGenerator = async () => {
  try {
    const randomPrompt =
      PROMPTS[Math.floor(Math.random() * PROMPTS.length)];

    const image = await hf.textToImage({
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: randomPrompt
    });

    const base64Image = Buffer.from(await image.arrayBuffer()).toString("base64");

    const uploadRes = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64Image}`,
      { folder: "daily_ai_images" }
    );

    await Image.create({
      cloudinaryId: uploadRes.public_id,
      url: uploadRes.secure_url,
      title: randomPrompt
    });

    console.log(" Daily image generated");

  } catch (err) {
    console.error(" Daily image error:", err.message);
  }
};


const getAllImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  dailyImageGenerator,
  getAllImages
};