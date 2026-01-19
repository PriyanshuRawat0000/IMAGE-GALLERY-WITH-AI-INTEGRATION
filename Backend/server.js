const express = require('express');
require('dotenv').config();
import cron from "node-cron";
import { dailyImageGenerator } from "./src/controllers/image.js";

const app = express();

const PORT = process.env.PORT || 5000;

// app.get('/', (req, res) => {
//     res.send("from thailand");
// }

// )



app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
})



// every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log("⏰ Running daily image job");
  await dailyImageGenerator();
});
