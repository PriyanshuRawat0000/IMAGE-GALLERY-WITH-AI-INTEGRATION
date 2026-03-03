import axios from "axios";
const apiURL=import.meta.env.VITE_API_URL;
const API =axios.create({
    baseURL:apiURL,
    withCredentials:true
});


export default API;