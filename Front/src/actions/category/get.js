import { BASEURL } from '../../config/baseurl'
const GETTCATEGORIES = "GETTCATEGORIES";
const GETTINGCATEGORIES = "GETTINGCATEGORIES";
const FAILGETCATEGORIES = "FAILGETCATEGORIES";


const getcategories = (data) => ({ type: GETTCATEGORIES, data });
const gettingcategories = () => ({ type: GETTINGCATEGORIES });
const failgetcategories = () => ({ type: FAILGETCATEGORIES });


function get()  {
    return async (dispatch, getState) => {
        dispatch(gettingcategories());
        try {
            let response = await fetch(BASEURL + 'categories', 
            { 
                method: 'GET' 
            });

            let jsonresponse = await response.json()

            if (response.ok)
            {
                console.log(jsonresponse);
                dispatch(getcategories([...jsonresponse]))
            }
            else
            {
                jsonresponse.error && jsonresponse.error.trim() ? dispatch(failgetcategories(jsonresponse.error)) : dispatch(failgetcategories("error when trying to get post"));
            }
        }
        catch (err)
        {
            console.log(err); 
            dispatch(failgetcategories("error when trying to get post")); 
        }
    }
}

export default get;