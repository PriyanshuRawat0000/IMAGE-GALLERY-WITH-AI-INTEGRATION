const nodeMailer=require('nodemailer');

const result=require("dotenv").config();

const transporter=nodeMailer.createTransport(
        {
            service:'gmail',
            auth:{
                user:process.env.SUPPORT_EMAIL_ID,
                pass:process.env.GOOGLE_APP_PAASWORD
                
            }
        }
    )


const sendEmail=async (email,code)=>{
    
    try{
        const verificationString=code;
        await transporter.sendMail({
            from:`"AI Gallery" <${email}>`,
            to:email,
            subject:"Verification mail for AI image Gallery",
            html: `
                <h2>Welcome to AI Gallery</h2>
                <p>Below is your verification text code</p>
                <h1>${verificationString}</h1>
                <p>This code will expire in 5 minutes.</p>
            `

        })
        console.log("email sent");
        return true;
    }
    catch(err){
        console.log("email sending failed");
        console.log(err);
        return false;
    }
   

}
sendEmail("priyanshurawat3.1415@gmail.com");


module.exports=sendEmail