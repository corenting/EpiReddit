import { BASEURL } from '../../config/baseurl'
import getAction from "./get"

const FAITGETCOMMENTS = "FAILGETCOMMENTS";

const failgetcomments = () => ({ type: FAITGETCOMMENTS });


function vote(jwt, post_id, comment_id, upvote, downvote)  {
    return async (dispatch, getState) => {
        try {
            let response = await fetch(BASEURL + 'votes/comment',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                },
                body: JSON.stringify({ comment_id, upvote, downvote })
            });

            let jsonresponse = await response.json()
            if (response.ok)
            {
                console.log(jsonresponse);
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

export default vote;