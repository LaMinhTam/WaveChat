import Cookies from "js-cookie";
import { COOKIE_DOMAIN } from "../constants/global";

const accessTokenKey = "wave_access_token";
const userId = "wave_user_id";
const userName = "wave_user_name";

const objCookies = {
    expires: 30,
    domain: COOKIE_DOMAIN,
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
            domain: COOKIE_DOMAIN,
        });
    }
};

export const saveUserId = (id) => {
    if (id) {
        Cookies.set(userId, id, {
            ...objCookies,
        });
    } else {
        Cookies.remove(userId, {
            ...objCookies,
            path: "/",
            domain: COOKIE_DOMAIN,
        });
    }
};

export const saveUserName = (name) => {
    if (name) {
        Cookies.set(userName, name, {
            ...objCookies,
        });
    } else {
        Cookies.remove(userName, {
            ...objCookies,
            path: "/",
            domain: COOKIE_DOMAIN,
        });
    }
};

export const getToken = () => {
    const access_token = Cookies.get(accessTokenKey);
    return access_token;
};

export const getUserId = () => {
    const id = Cookies.get(userId);
    return id;
};

export const getUserName = () => {
    const name = Cookies.get(userName);
    return name;
};
