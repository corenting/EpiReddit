export const login_reducer = (state = { isAuthenticated : false, jwt: '', isError : false, errorMessage : '', isFetching : false} , action) => {
    switch (action.type) {
        case "LOGGED":
            return {
                ...state,
                isAuthenticated : true,
                jwt : action.data.token,
                isFetching : false,
                isError : false,
                errorMessage : ''
            };
        case "LOGOUT":
            return {
                ...state, 
                isAuthenticated : false,
                jwt : '',
                isFetching : false,
                isError : false,
                errorMessage : ''
            };
        case "FAILLOG":
            return {
                ...state,   
                isError : true,
                errorMessage : action.data,
                isFetching : false
            };
        case "LOGGING":
            return {
                ...state,
                isFetching : true
            }
        default:
            return state;
    }
}