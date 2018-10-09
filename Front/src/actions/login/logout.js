const LOGOUT = "LOGOUT";

const logout = () => ({ type: LOGOUT })


function logoutFunc()  {
    localStorage.removeItem("jwt")
    return logout();
};

export default logoutFunc