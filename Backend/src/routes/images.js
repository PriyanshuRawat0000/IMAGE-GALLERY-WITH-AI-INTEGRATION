
const express = require("express");
const {getAllImages,addImage,dailyImageGenerator} = require("../controllers/imagegenerator.js");
const {imageMiddleware} =require("../middlewares/imageMiddleware.js")

const router = express.Router();
router.post("/generateImage",dailyImageGenerator);
router.post("/addImage",imageMiddleware,addImage);
router.get("/",getAllImages);
module.exports = router;