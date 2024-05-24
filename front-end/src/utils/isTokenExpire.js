import { jwtDecode } from "jwt-decode";

export function isTokenExpire(access_token) {
    if (!access_token) {
        return;
    }

    const decodedToken = jwtDecode(access_token);

    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp < currentTime) {
        return true;
    } else {
        return false;
    }
}
