const express = require('express');
require('dotenv').config();
const connectDB = require('./src/config/db');
const app = express();
const authRoutes = require('./src/routes/auth');
const bodyParser = require('body-parser');
const cron = require("node-cron");
const  dailyImageGenerator= require("./src/controllers/image.js");

const PORT = process.env.PORT || 5000;

app.use(express.json());

// app.get('/', (req, res) => {
//     res.send("from thailand");
// }

// )

app.use('/api/auth', authRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
})
app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
})



// every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log(" Running daily image job");
  await dailyImageGenerator();
});
