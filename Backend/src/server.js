const express = require('express');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;

// app.get('/', (req, res) => {
//     res.send("from thailand");
// }

// )



app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
})