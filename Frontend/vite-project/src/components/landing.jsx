import React from 'react';
import {useNavigate,Navigate} from 'react-router-dom';
import './landing.css';

const Landing=()=>{
    const navigate = useNavigate();
    return (
        
        
        <div className="landing">
            <div>
                <h1>Welcome to the Image Gallery</h1>
                <h2>Explore and download your favorite images</h2>
                <div>
                    <button onClick={() => navigate('/login')}>Login</button>
                    <button onClick={() => navigate('/signUp')}>Sign Up</button>
                </div>
            </div>
        </div>
    )
}

export default Landing;