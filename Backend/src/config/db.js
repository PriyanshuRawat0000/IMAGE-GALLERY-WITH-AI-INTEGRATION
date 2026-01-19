const mongoose=require('mongoose');
require('dotenv').config();

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MONGODB CONNECTED SUCCESSFULLY");
    }

    catch(err){
        console.error("MONGODB CONNECTION FAILED",err);
        process.exit(1);
    }
}

module.exports=connectDB;