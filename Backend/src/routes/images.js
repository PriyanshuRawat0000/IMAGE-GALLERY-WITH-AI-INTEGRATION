
const express = require("express");
const {getAllImages} = require("../controllers/imagegenerator.js");


const router = express.Router();

router.get("/dashboard", getAllImages);
