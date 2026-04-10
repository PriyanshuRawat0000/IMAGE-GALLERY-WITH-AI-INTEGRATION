const express = require('express');
require('dotenv').config();
const connectDB = require('./src/config/db');
const app = express();
const authRoutes = require('./src/routes/auth');
const bodyParser = require('body-parser');
const cron = require("node-cron");
const { dailyImageGenerator } = require("./src/controllers/imagegenerator.js");
const cors = require('cors');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 5000;

app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions))
app.use(cookieParser());
app.use("/api/auth/fetchDetails",authRoutes);
app.use("/api/auth/saveProfile",authRoutes);
app.use("/api/images/addImage",require('./src/routes/images'));
app.use("/api/images/getImageByUserId",require('./src/routes/images'));
app.use("/api/images/generateImage",require('./src/routes/images'));
app.use('/api/auth', authRoutes);
app.use('/api/images', require('./src/routes/images'));
app.use('/', (req, res) => {
  res.send("API is running....");
});


connectDB();

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
  // testing functionality
  // (async () => {
  //   console.log("Testing daily image generator...");
  //   await dailyImageGenerator();
  // })();
})




// every day at 9 AM
// cron.schedule("0 9 * * *", async () => {
//   console.log(" Running daily image job");
//   await dailyImageGenerator();
// });


