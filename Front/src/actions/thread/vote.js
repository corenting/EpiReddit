import { BASEURL } from '../../config/baseurl'

const FAITGETCOMMENTS = "FAILGETCOMMENTS";

const failgetcomments = () => ({ type: FAITGETCOMMENTS });


function vote(jwt, post_id, upvote, downvote, reloadAction)  {
    return async (dispatch, getState) => {
        try {
            let response = await fetch(BASEURL + 'votes/post',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                },
                body: JSON.stringify({ post_id, upvote, downvote })
            });

            let jsonresponse = await response.json()
            if (response.ok)
            {
                console.log(jsonresponse);
                reloadAction();
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