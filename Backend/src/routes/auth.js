const express =require('express');
const router = express.Router();


router.post('/login',(req,res)=>{
    res.send('login');
})

router.post('/register',(req,res)=>{
    res.send('register');
})

router.put('/update',(req,res)=>{
    res.send('update user');
})
module.exports=router;