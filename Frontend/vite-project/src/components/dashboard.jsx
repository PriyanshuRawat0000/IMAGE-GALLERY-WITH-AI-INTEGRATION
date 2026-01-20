import React from 'react'
import {useState} from 'react'
function dashboard() {
  const [isSorted,setIsSorted] = useState(true);
  
  return (
    <div>
      <div className="dashboard-header">
        <div className="logo"></div>
        <div className="home"></div>
        <div className="library"></div>
        <div className="profile"></div>
        <div className="logout"></div>

      </div>
      <div className="display">
        <div className="greeting">
            <h2 id="greet-text">Welcome back, User</h2>
            
        </div>
      </div>
    </div>
  )
}

export default dashboard
