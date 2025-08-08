import { createContext } from "react";

export default createContext({
    isAuthenticated: false,
    setIsAuthenticated: value => { },
    userConnected: null,
    setUserConnected: value => { },
    });