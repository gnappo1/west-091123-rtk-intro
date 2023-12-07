export const getToken = () => localStorage.getItem("jwt_token")
export const getRefreshToken = () => localStorage.getItem("refresh_token")
export const setToken = (token) => localStorage.setItem("jwt_token", token)