import React from 'react';
import { Outlet,Navigate } from 'react-router-dom';

export const ProtectedRoutes=()=>{
    const auth=localStorage.getItem('token');
    
    if(false){
        return <Navigate to='/login'/>
    }
    return <Outlet/>;
}