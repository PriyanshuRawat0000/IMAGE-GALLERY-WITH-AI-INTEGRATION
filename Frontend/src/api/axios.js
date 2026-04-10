import axios from "axios";
const apiURL=import.meta.env.VITE_API_URL;
const API =axios.create({
    baseURL:apiURL,
    withCredentials:true
});
let isRefreshed=false;
function successHandler(response){
    return response;
}

async function errorHandler(error){
    
    const originalRequest=error.config;
    
    console.log(`${originalRequest._retry}`);
    if(error.response && error.response.status===401 && !originalRequest._retry && !isRefreshed){
        console.log("your token expired trying to refresh token")
        originalRequest._retry=true;
        isRefreshed=true;
        try{
            await API.post("/api/auth/refresh");
            console.log("your token has been refreshed");
            return API(originalRequest);

        }
        catch(refreshError){
            return Promise.reject(refreshError);

        }
    }
    else{
        console.log("something is wrong");
    }
    return Promise.reject(error)
   
}

API.interceptors.response.use(
    successHandler,
    errorHandler
)
export default API;