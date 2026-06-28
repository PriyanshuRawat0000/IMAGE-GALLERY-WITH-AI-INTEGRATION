
import API from '../api/axios.js';

export const responseGoogle = async (authResult, navigate) => {
    try {
        console.log(authResult);
        console.log("i was able to reach responsegoogle");
      const response = await API.post('api/auth/sendGoogleCode', {
        credential: authResult.credential,
      })
      console.log(response);
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

