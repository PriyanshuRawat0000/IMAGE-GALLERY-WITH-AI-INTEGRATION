

const { HfInference } = require("@huggingface/inference");
const cloudinary = require("../config/cloudinary");
const Image = require("../models/image");
const User =require("../models/user");
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const PROMPTS = [
  "anime scenery ",
  "re zero anime style",
  "A peaceful village in anime style",
  "A anime girl with blue hair and a sword",
  "Doraemon friends "
];

const dailyImageGenerator = async () => {
  try {
    const randomPrompt =
      PROMPTS[Math.floor(Math.random() * PROMPTS.length)];

    const image = await hf.textToImage({
      //"black-forest-labs/FLUX.1-dev",
      //"stabilityai/stable-diffusion-xl-base-1.0"
      model:"stabilityai/stable-diffusion-xl-base-1.0",

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

const generateImage = async (req,res) => {
  console.log("entered generateImage");
  
  try {
    const prompt=req.body.Prompt;
    console.log(prompt);

    const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "Generate a short, creative title (2-4 words) for an AI-generated image prompt. No quotes. No punctuation."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.8,
    max_tokens: 20
  });

  const Title= response.choices[0].message.content.trim();
    console.log(`${Title}`);
    const image = await hf.textToImage({
      //"black-forest-labs/FLUX.1-dev",
      //"stabilityai/stable-diffusion-xl-base-1.0"
      //model:"stabilityai/stable-diffusion-xl-base-1.0",
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: prompt
    });

    const base64Image = Buffer.from(await image.arrayBuffer()).toString("base64");

    const uploadRes = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64Image}`,
      { folder: "daily_ai_images" }
    );

    await Image.create({
      cloudinaryId: uploadRes.public_id,
      url: uploadRes.secure_url,
      title: Title
    });
    const responseImage={
      cloudinaryId: uploadRes.public_id,
      url: uploadRes.secure_url,
      title: Title
    };
    console.log("image generated");
    return res.status(200).json({
      generatedImage:responseImage
    });

  } catch (err) {
    return res.status(500).json({
      message: "Image generation failed",
      error: err.message
    });
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
const addImage = async (req, res) => {
  try {

      const { imageId } = req.body;

      const user = await User.findById(req.userId);

      user.imageIds.push(imageId);

      await user.save();
      // const image =await Image.findById(imageId);
      // image.downloadCount+=1;
      // await image.save();
      await Image.findByIdAndUpdate(
        imageId,
        { $inc: { downloadCount: 1 } }
      );
      res.status(200).json({
        message: "Image added"
      });

  } catch(err){
      res.status(500).json({error:err.message});
  }
};




const getImagesByUserId = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const imageList = user.imageIds;

   
    const images = await Image.find({
      _id: { $in: imageList }
    });

    res.status(200).json(images);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};
module.exports = {
  dailyImageGenerator,
  getAllImages,
  addImage,
  getImagesByUserId,
  generateImage
};