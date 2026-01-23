import React from 'react';
import './login.css';
import {useState} from 'react';
import API from '../api/axios.js';



const Login = () => {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  const handleSubmit=async(form)=>{
    form.preventDefault();
    try{
      const res=await API.post("/auth/login",{
        email,
        password
      });
      //localStorage.setItem("accessToken",res.data.accessToken);
      // console.log("FULL RESPONSE:", res.data);
      // alert(JSON.stringify(res.data));

      alert(res.data.message);
    }
    catch(err){
      alert(err.response.data.message);
    }
  }

  return (
    <div className="login-container" onSubmit={handleSubmit}>
      <h1>Welcome Back</h1>
      <h3>Login to your Account</h3>
      <form className='loginForm'>
       
        <label htmlFor='email'>Email</label>
        <br />
        <input type='email' id='email' value={email} name='email' placeholder='Enter your email' onChange={(e)=>setEmail(e.target.value)}required />
        <br />
        <label htmlFor='password'>Password</label>
        <br />
        <input type='password' id='password' name='password' placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)} required />
        <br />
        <button type='submit' >Login</button>
      </form>
      <h4>Dont have an account? <a href='/signUp'>Sign Up</a></h4>
    </div>
  )
}

export default Login
