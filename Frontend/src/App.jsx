import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Landing from './components/landing.jsx'
import Login from './components/login.jsx'
import SignUp from './components/signin.jsx'
import Dashboard from './components/dashboard.jsx'
import Library from './components/library.jsx'
import Profile from './components/profile.jsx'
import { ProtectedRoutes } from './utils/protectedroutes.jsx'

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route element={<ProtectedRoutes />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/library' element={<Library/>}/>
            <Route path='/profile' element={<Profile/>}/>
          </Route>
        </Routes>
      </Router>

    </div>
  )
}

export default App
