import { BASEURL } from '../../config/baseurl'
const GETTHREAD = "GETTHEAD";
const GETTINGTHREADS = "GETTINGTHREADS";
const FAILGETTHREAD = "FAILGETTHREAD";


const getthread = (data) => ({ type: GETTHREAD, data });
const gettingthread = () => ({ type: GETTINGTHREADS });
const failgetthread = () => ({ type: FAILGETTHREAD });


function getAll(jwt, id)  {
    return async (dispatch, getState) => {
        dispatch(gettingthread());
        try {
            let authenticatedurl = jwt ? 'postWithUserVotes' : 'post'
            let response = await fetch(BASEURL + 'posts/' + authenticatedurl + '?post_id=' + id,
            {
                headers: {
                    'Authorization': 'Bearer ' + jwt
                },    
            });

            let jsonresponse = await response.json()
            if (response.ok)
            {
                dispatch(getthread(jsonresponse))
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

export default getAll;