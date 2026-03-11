import React from 'react'
import './signin.css'
import API from '../api/axios.js'
import {Link,useNavigate} from 'react-router-dom';
import {useState} from 'react'
const SignUp = () => {
  const [username,setUsername]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const navigate=useNavigate();
  const handleSubmit=async (e)=>{
    e.preventDefault();
    try{
      const res=await API.post("/api/auth/signup",{
        username,
        email,
        password,
      })
      console.log(res.data);
      alert(res.data.message);
      //localStorage.setItem("accessToken", res.data.accessToken);
      navigate("/dashboard", { replace: true });
    }
    catch(err){
      
      //console.log("AXIOS ERROR:", err);


      alert(err.response.data.message)
    }

  }
  return (
    <div className="signin-container">
      <h1>Create an Account</h1>
      <h3>Sign up to get started</h3>
      <form className='signinForm' onSubmit={handleSubmit}>

        <label name='username'  >Username</label>
        <br />
        <input type='text' name='username' placeholder='Enter your username' value={username} onChange={(e)=>setUsername(e.target.value)} required />
        <br />
        <label name='email'>Email</label>
        <br />
        <input type='email' name='email' placeholder='Enter your email'value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <br />
        <label name='password'>Password</label>
        <br />
        <input type='password' name='password' placeholder='Create a password' value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <br />
        <button type='submit'>Sign Up</button>
      </form>
      <h4>Already have an account? <Link to="/login">Login</Link></h4>
    </div>
  )
}

export default SignUp
