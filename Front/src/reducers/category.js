export const category_reducer = (state = { categories : [], isError : false, errorMessage : '', isFetching : false,}, action) => {
    switch (action.type) {
        case "GETTCATEGORIES":
            return {
                ...state,
                categories : action.data,
                isFetching : false,
                isError : false,
                errorMessage : ''
            };
        case "FAILGETCATEGORIES":
            return {
                ...state,   
                isError : true,
                errorMessage : action.data,
                isFetching : false
            };
        case "GETTINGCATEGORIES":
            return {
                ...state,
                isFetching : true
            }
        default:
            return state;
    }
}