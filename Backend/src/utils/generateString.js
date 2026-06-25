const crypto=require('crypto');


const generateString=()=>{
    const code=crypto.randomBytes(16).toString("hex");
    
    return code;
}

module.exports=generateString