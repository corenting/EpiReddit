import { BASEURL } from '../../config/baseurl'

const POSTEDTHREAD = "POSTEDTHREAD";
const FAILGETTHREAD = "FAILGETTHREAD";

const postthread = (data) => ({ type: POSTEDTHREAD, data });
const failgetthread = () => ({ type: FAILGETTHREAD });

function postThread(jwt, category_id, title, content)  {
    return async (dispatch, getState) => {
        try {
            let response = await fetch(BASEURL + 'posts/selfpost',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                },
                body: JSON.stringify({ category_id, title, content })
            });

            let jsonresponse = await response.json()
            if (response.ok)
            {
                console.log(jsonresponse);
                dispatch(postthread(jsonresponse))
            }
            else
            {
                jsonresponse.error && jsonresponse.error.trim() ? dispatch(failgetthread(jsonresponse.error)) : dispatch(failgetthread("error when trying to get post"));
            }
        }
        catch (err)
        {
            console.log(err); 
            dispatch(failgetthread("error when trying to get post")); 
        }
    }
}

export default postThread;