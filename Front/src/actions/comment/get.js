import { BASEURL } from '../../config/baseurl'
const GETCOMMENTS = "GETCOMMENTS";
const GETTINGCOMMENTS = "GETTINGCOMMENTS";
const FAITGETCOMMENTS = "FAILGETCOMMENTS";


const getcomments = (data) => ({ type: GETCOMMENTS, data });
const gettingcomments = () => ({ type: GETTINGCOMMENTS });
const failgetcomments = () => ({ type: FAITGETCOMMENTS });


function getComments(jwt, id)  {
    return async (dispatch, getState) => {
        dispatch(gettingcomments());
        try {
            let authenticatedurl = jwt ? 'forPostWithUserVotes' : 'forPost'
            let response = await fetch(BASEURL + 'comments/' + authenticatedurl + '?post_id=' + id,
            {
                headers: {
                    'Authorization': 'Bearer ' + jwt
                },    
            });

            let jsonresponse = await response.json()
            if (response.ok)
            {
                console.log(jsonresponse);
                dispatch(getcomments(jsonresponse))
            }
            else
            {
                jsonresponse.error && jsonresponse.error.trim() ? dispatch(failgetcomments(jsonresponse.error)) : dispatch(failgetcomments("error when trying to get post"));
            }
        }
        catch (err)
        {
            console.log(err); 
            dispatch(failgetcomments("error when trying to get post")); 
        }
    }
}

export default getComments;