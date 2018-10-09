import { BASEURL } from '../../config/baseurl'

const GETTHREADS = "GETTHREADS";
const GETTINGTHREADS = "GETTINGTHREADS";
const FAILGETTHREAD = "FAILGETTHREAD";


const getthreads = (data) => ({ type: GETTHREADS, data });
const gettingthread = () => ({ type: GETTINGTHREADS });
const failgetthread = () => ({ type: FAILGETTHREAD });

function getAll(jwt, sort, page, category)  {
    return async (dispatch, getState) => {
        dispatch(gettingthread());
        try {
            let authenticatedurl = jwt ? 'listWithUserVotes' : 'list'
            let response = await fetch(BASEURL + 'posts/' + authenticatedurl + '?page=' + page + '&sort=' + sort + '&category=' + category,
            {
                headers: {
                    'Authorization': 'Bearer ' + jwt
                },    
            });

            let jsonresponse = await response.json()
            if (response.ok)
            {
                dispatch(getthreads(jsonresponse))
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