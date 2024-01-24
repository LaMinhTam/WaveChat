import { signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "./firebaseConfig";
import { setAccessToken, setUser } from "../store/authSlice";

export const handleLoginWithGoogle = async (navigate, dispatch) => {
    try {
        const result = await signInWithPopup(auth, googleAuthProvider);
        dispatch(setUser(result.user));
        dispatch(setAccessToken(result.user.accessToken));
        localStorage.setItem("accessToken", result.user.accessToken);
        navigate("/");
    } catch (error) {
        console.error(error);
    }
};
