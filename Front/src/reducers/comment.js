export const comment_reducer = (state = { comments : [], postedComment: false, isError : false, errorMessage : '', isFetching : false,}, action) => {
    switch (action.type) {
        case "GETCOMMENTS":
            return {
                ...state,
                comments : action.data,
                isFetching : false,
                isError : false,
                errorMessage : ''
            };
        case "VOTECOMMENT":
            return {
                ...state,
                comments : state.comments.map((item) => item.id === action.data.id ? action.data : item )
            }
        case "FAILGETCOMMENTS":
            return {
                ...state,   
                isError : true,
                errorMessage : action.data,
                isFetching : false
            };
        case "GETTINGCOMMENTS":
            return {
                ...state,
                isFetching : true
            }
        case "POSTED":
            return {
                ...state,
                postedComment : true
            }
        default:
            return state;
    }
}