export const thread_reducer = (state = { threads : [], isError : false, errorMessage : '', isFetching : false, thread : {}} , action) => {
    switch (action.type) {
        case "GETTHREADS":
            return {
                ...state,
                threads : action.data,
                isFetching : false,
                isError : false,
                errorMessage : ''
            };
        case "POSTEDTHREAD":
            return {
                ...state,
                posted : true,
                post_id : action.data.post_id
            }
        case "GETTHEAD":
            return {
                ...state,
                thread : action.data,
                isFetching : false
            };
        case "FAILGETTHREAD":
            return {
                ...state,   
                isError : true,
                errorMessage : action.data,
                isFetching : false
            };
        case "GETTINGTHREADS":
            return {
                ...state,
                isFetching : true
            }
        default:
            return state;
    }
}