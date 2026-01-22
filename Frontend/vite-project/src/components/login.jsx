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
      localStorage.setItem("accessToken",res.data.accessToken);
      alert("Login Successful");
    }
    catch(err){
      alert(err.response.data.message);
    }
  }

  return (
    <div className="login-container">
      <h1>Welcome Back</h1>
      <h3>Login to your Account</h3>
      <form className='loginForm'>
        form.preventDefault();

        <label htmlFor='email'>Email</label>
        <br />
        <input type='email' id='email' name='email' placeholder='Enter your email' required />
        <br />
        <label htmlFor='password'>Password</label>
        <br />
        <input type='password' id='password' name='password' placeholder='Enter your password' required />
        <br />
        <button type='submit' onClick={()}>Login</button>
      </form>
      <h4>Dont have an account? <a href='/signUp'>Sign Up</a></h4>
    </div>
  )
}

export default Login
