import Cookies from "js-cookie";

const accessTokenKey = "wave_access_token";

const objCookies = {
    expires: 30,
    domain: "localhost",
};

export const saveToken = (access_token) => {
    if (access_token) {
        Cookies.set(accessTokenKey, access_token, {
            ...objCookies,
        });
    } else {
        Cookies.remove(accessTokenKey, {
            ...objCookies,
            path: "/",
            domain: "localhost",
        });
    }
};

export const getToken = () => {
    const access_token = Cookies.get(accessTokenKey);
    return access_token;
};