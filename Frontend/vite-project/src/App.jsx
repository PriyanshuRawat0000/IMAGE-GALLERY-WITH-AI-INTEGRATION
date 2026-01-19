import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Landing from './components/landing.jsx'
import Login from './components/login.jsx'
import SignUp from './components/signin.jsx'

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signUp' element={<SignUp />} />
        </Routes>
      </Router>

    </div>
  )
}

export default App
