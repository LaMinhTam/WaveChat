import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./firebaseConfig";

export default async function handleSendOTP(
    phone,
    recaptcha = "recaptcha-container"
) {
    let verify = new RecaptchaVerifier(
        recaptcha,
        {
            size: "visible",
        },
        auth
    );
    const formatPh = "+" + phone;

    const confirmationResult = await signInWithPhoneNumber(
        auth,
        formatPh,
        verify
    );
    return confirmationResult;
}
