import React from 'react';
import './login.css';
import {useState} from 'react';
import {Link} from 'react-router-dom';
import API from '../api/axios.js';
import {useNavigate} from 'react-router-dom';


const Login = () => {

  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const navigate=useNavigate();
  
  const handleSubmit=async(form)=>{
    form.preventDefault();
    
    try{
      //navigate("/dashboard", { replace: true });
      const res=await axios.post("http://localhost:5000/api/auth/login",{
        email,
        password
      });
      //localStorage.setItem("accessToken",res.data.accessToken);
      console.log("FULL RESPONSE:", res.data);
      // alert(JSON.stringify(res.data));

      alert( `hello ${res.data.message}`);
      if (res.data.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
      }


      navigate("/dashboard", { replace: true });
    }
    catch(err){
      alert(err.response.data.message);
    }
  }

  return (
    <div className="login-container" >
      <h1>Welcome Back</h1>
      <h3>Login to your Account</h3>
      <form className='loginForm' onSubmit={handleSubmit}>
       
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
      <h4>Dont have an account? <Link to="/signup">Sign Up</Link></h4>
    </div>
  )
}

export default Login
