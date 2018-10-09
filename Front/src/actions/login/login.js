import { BASEURL } from '../../config/baseurl'

const LOGGED = "LOGGED";
const FAILLOG = "FAILLOG";
const LOGGING = "LOGGING";

const logged = (data) => ({ type: LOGGED, data })
const faillog = (data) => ({ type: FAILLOG, data })
const logging = () => ({ type: LOGGING })


function login(userName, password)  {
    return async (dispatch, getState) => {
        dispatch(logging());
        try {
            let response = await fetch(BASEURL + 'users/login',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },      
                body: JSON.stringify({ username : userName, password : password })
            })
            let jsonresponse = await response.json();
            if (response.ok)
            {
                console.log("Logged")
                if (jsonresponse.token)
                {
                    localStorage.setItem("jwt", jsonresponse.token);
                }
                return dispatch(logged(jsonresponse));
            }
            else {
                jsonresponse.error && jsonresponse.error.trim() ? dispatch(faillog(jsonresponse.error)) : dispatch(faillog("error when trying to log"));
            }
        }
        catch(err) 
        { 
            console.log(err); dispatch(faillog("error when trying to log")); 
        }          
    }
};

export default login