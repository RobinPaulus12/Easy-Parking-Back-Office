
import axios from 'axios';
//import { REACT_APP_API_URL, TOKEN_NAME } from '@env';
import jwtDecode from 'jwt-decode';
import { getItem, removeItem, setItem } from './localStorage';

export const REACT_APP_API_URL = 'http://localhost:3001';  // Remplace par ton URL d'API
export const TOKEN_NAME = 'projectToken';

export const logout = async () => {
    removeItem(TOKEN_NAME);
}

export const hasAuthentication = async () => {
    
    let result = { isAuthneticated: false, userDatas: {} }; 

    const token = getItem(TOKEN_NAME);
    const { exp, value } = jwtDecode(token);
    const tokenIsValid = exp * 1000 > new Date().getTime();

    result.isAuthneticated = token && tokenIsValid;
    result.userDatas = value;

    !tokenIsValid && removeItem(TOKEN_NAME).then(() => result.userDatas = {}); // ca supprime le token
    return result;

}

export const login = async ({ username, password }) => {
    const res = await axios.post(`${REACT_APP_API_URL}/user/login`, { username, password });

    const token = res.data.token;

    if (!token) {
        throw new Error("Token non reçu du serveur");
    }

    setItem({ tokenName: TOKEN_NAME, token});
    const decoded = jwtDecode(token); // <-- on décode
    return decoded;
}

