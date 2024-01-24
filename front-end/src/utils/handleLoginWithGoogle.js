import { signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "./firebaseConfig";
import { toast } from "react-toastify";

export const handleLoginWithGoogle = async (navigate) => {
    try {
        await signInWithPopup(auth, googleAuthProvider);
        toast.success("Login successfully");
        navigate("/");
    } catch (error) {
        toast.error("Login failed, please try again later");
    }
};
