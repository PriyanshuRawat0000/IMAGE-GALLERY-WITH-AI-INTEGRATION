
const express = require("express");
const {getAllImages,addImage,dailyImageGenerator,getImagesByUserId,generateImage,getCountPerUser} = require("../controllers/imagegenerator.js");
const {imageMiddleware} =require("../middlewares/imageMiddleware.js")

const router = express.Router();
router.post("/generateImage",dailyImageGenerator);
router.post("/addImage",imageMiddleware,addImage);
router.post("/getImageByUserId",imageMiddleware,getImagesByUserId);
router.post("/promptToImage",imageMiddleware,generateImage);
router.post("/getCountPerUser",imageMiddleware,getCountPerUser);
router.get("/",getAllImages);
module.exports = router;