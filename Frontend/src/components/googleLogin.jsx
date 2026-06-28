
import API from '../api/axios.js';

export const responseGoogle = async (authResult, navigate) => {
    try {
        
      const response = await API.post('api/auth/sendGoogleCode', {
        credential: authResult.credential,
      })
      
      if (response.status === 200 || response.status === 201) {
        navigate("/dashboard", { replace: true });
      }
      else {
        alert("unauthorised connection");
      }
    }
    catch (err) {
      console.log(err);
    }
}

