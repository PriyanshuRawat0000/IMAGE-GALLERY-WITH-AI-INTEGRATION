import React from 'react'

const Login = () => {
  return (
    <div>
      <h1>Welcome Back</h1>
      <h3>Login to your Account</h3>
      <form className='loginForm'>
        
        <label htmlFor='email'>Email</label>
        <br />
        <input type='email' id='email' name='email' placeholder='Enter your email' required />
        <br />
        <label htmlFor='password'>Password</label>
        <br />
        <input type='password' id='password' name='password' placeholder='Enter your password' required />
        <br />
        <button type='submit'>Login</button>
      </form>
      <h4>Dont have an account? <a href='/signUp'>Sign Up</a></h4>
    </div>
  )
}

export default Login
