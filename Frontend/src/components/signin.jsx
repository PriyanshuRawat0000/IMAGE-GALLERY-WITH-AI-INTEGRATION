import React, { useEffect, useState } from 'react'
import './signin.css'
import API from '../api/axios.js'
import { Link, useNavigate } from 'react-router-dom'

const SignUp = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verificationString, setVerificationString] = useState('')
  const [showOtpStep, setShowOtpStep] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [otpAttemptsLeft, setOtpAttemptsLeft] = useState(5)
  const [cooldown, setCooldown] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (cooldown <= 0) {
      return undefined
    }

    const timer = setInterval(() => {
      setCooldown((current) => Math.max(current - 1, 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldown])

  const resetOtpState = () => {
    setShowOtpStep(false)
    setVerificationString('')
    setOtpAttemptsLeft(5)
    setCooldown(0)
    setIsSendingOtp(false)
    setIsVerifyingOtp(false)
  }

  const handleInitialSubmit = async (e) => {
    e.preventDefault()

    try {
      setIsSendingOtp(true)
      await API.post('/api/auth/sendCode', {
        email,
        username,
        password
      })

      setShowOtpStep(true)
      setVerificationString('')
      setOtpAttemptsLeft(5)
      setCooldown(60)
    } catch (err) {
      console.log(err)
      alert(err?.response?.data?.message || 'Unable to send verification string')
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()

    if (otpAttemptsLeft <= 0) {
      alert('You have used all attempts. Please resend the verification string or change your email.')
      return
    }

    try {
      setIsVerifyingOtp(true)

      // await API.post('/api/auth/verifyOtp', {
      //   email,
      //   otp: verificationString,
      // })

      const res = await API.post('/api/auth/signup', {
        username,
        email,
        password,
        code:verificationString
      })

      alert(res.data.message)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      alert(err?.response?.data?.message || 'Invalid verification string')
      setOtpAttemptsLeft((current) => Math.max(current - 1, 0))
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  const handleResendOtp = async () => {
    if (cooldown > 0) {
      return
    }

    try {
      setIsSendingOtp(true)
      await API.post('/api/auth/sendCode', {
        email,
        username,
        password
      })

      setVerificationString('')
      setOtpAttemptsLeft(5)
      setCooldown(60)
      alert('Verification string resent successfully')
    } catch (err) {
      alert(err?.response?.data?.message || 'Unable to resend verification string')
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleChangeEmail = () => {
    resetOtpState()
  }

  const canVerifyOtp = verificationString.trim().length > 0 && otpAttemptsLeft > 0 && !isVerifyingOtp

  return (
    <div className="signin">
      <div className="signin-container">
        <h1>Create an Account</h1>
        {!showOtpStep ? (
          <>
            <h3>Sign up to get started</h3>
            <form className="signinForm" onSubmit={handleInitialSubmit}>
              <label name="username">Username</label>
              <br />
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <br />
              <label name="email">Email</label>
              <br />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <br />
              <label name="password">Password</label>
              <br />
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <br />
              <button type="submit" disabled={isSendingOtp}>
                {isSendingOtp ? 'Sending verification string...' : 'Send Verification String'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h3>Enter the verification string sent to {email}</h3>
            <form className="signinForm" onSubmit={handleOtpSubmit}>
              <label htmlFor="verificationString">Verification String</label>
              <br />
              <input
                type="text"
                id="verificationString"
                name="verificationString"
                placeholder="Enter the verification string"
                value={verificationString}
                onChange={(e) => setVerificationString(e.target.value.trim())}
                autoComplete="one-time-code"
                required
              />
              <br />
              <button type="submit" disabled={!canVerifyOtp}>
                {isVerifyingOtp ? 'Verifying...' : 'Verify String'}
              </button>
            </form>

            <div className="otp-actions">
              <button
                type="button"
                className="otp-secondary-button"
                onClick={handleResendOtp}
                disabled={cooldown > 0 || isSendingOtp}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : isSendingOtp ? 'Resending...' : 'Resend Verification String'}
              </button>

              <button type="button" className="otp-link-button" onClick={handleChangeEmail}>
                Change Email
              </button>

              <p className="otp-help">Attempts left: {otpAttemptsLeft}</p>

              {otpAttemptsLeft <= 0 && (
                <p className="otp-error">No attempts left for this verification string. Resend a new code or change your email.</p>
              )}
            </div>
          </>
        )}

        <h4>
          Already have an account? <Link to="/login">Login</Link>
        </h4>
      </div>
    </div>
  )
}

export default SignUp
