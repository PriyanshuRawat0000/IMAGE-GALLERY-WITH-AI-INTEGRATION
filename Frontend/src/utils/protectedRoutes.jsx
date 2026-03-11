import React from 'react';
import { Outlet,Navigate } from 'react-router-dom';

export const ProtectedRoutes=()=>{
    const auth=localStorage.getItem('token');
    
    if(false){
       // alert("token not found")
        return <Navigate to='/login'/>
    }
    return <Outlet/>;
}


// import React, { useEffect, useState } from 'react';
// import { Outlet, Navigate } from 'react-router-dom';
// import API from '../api/axios.js';

// export const ProtectedRoutes = () => {
//     const [isAuthenticated, setIsAuthenticated] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const checkAuth = async () => {
//             try {
//                 const res = await API.get("/api/auth/check");
//                 setIsAuthenticated(res.data.authenticated);
//             } catch (err) {
//                 setIsAuthenticated(false);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         checkAuth();
//     }, []);

//     if (loading) return <div>Loading...</div>; // Show loading while checking
    
//     if (!isAuthenticated) {
//         return <Navigate to='/login' />;
//     }

//     return <Outlet />;
// };