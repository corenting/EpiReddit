import { BASEURL } from '../../config/baseurl'
import getAction from "./get"

const FAITGETCOMMENTS = "FAILGETCOMMENTS";
const POSTED = "POSTED"

const failgetcomments = () => ({ type: FAITGETCOMMENTS });
const posted = () => ({ type: POSTED });


function Reply(jwt, post_id, parent_id, content)  {
    return async (dispatch, getState) => {
        try {
            let response = await fetch(BASEURL + 'comments/comment',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                },
                body: JSON.stringify({ post_id, content, parent_id })
            });

            let jsonresponse = await response.json()
            if (response.ok)
            {
                console.log(jsonresponse);
                dispatch(posted())
                dispatch(getAction(jwt, post_id))
            }
            else
            {
                jsonresponse.error && jsonresponse.error.trim() ? dispatch(failgetcomments(jsonresponse.error)) : dispatch(failgetcomments("error when trying to vote"));
            }
        }
        catch (err)
        {
            console.log(err); 
            dispatch(failgetcomments("error when trying to vote")); 
        }
    }
}

export default Reply;