export const getItem = (tokenName) => {
    const token = localStorage.getItem(tokenName);
    return token;
}

export const setItem = ({ tokenName, token }) => {
    localStorage.setItem(tokenName, token)  
}

export const removeItem = (tokenName) => {
    localStorage.removeItem(tokenName);
}

