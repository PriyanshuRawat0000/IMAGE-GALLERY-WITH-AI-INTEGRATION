import React from 'react'
import './signin.css'

const SignUp = () => {
  return (
    <div className="signin-container">
      <h1>Create an Account</h1>
      <h3>Sign up to get started</h3>
      <form className='signinForm'>

        <label name='username'>Username</label>
        <br />
        <input type='text' name='username' placeholder='Enter your username' required />
        <br />
        <label name='email'>Email</label>
        <br />
        <input type='email' name='email' placeholder='Enter your email' required />
        <br />
        <label name='password'>Password</label>
        <br />
        <input type='password' name='password' placeholder='Create a password' required />
        <br />
        <button type='submit'>Sign Up</button>
      </form>
      <h4>Already have an account? <a href='/login'>Login</a></h4>
    </div>
  )
}

export default SignUp
