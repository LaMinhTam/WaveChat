import { toast } from "react-toastify";

export default async function handleVerifyOTP(confirmationResult, otp) {
    if (!otp) {
        toast.error("Sign up failed, OTP code is invalid");
        return;
    }
    try {
        await confirmationResult.confirm(otp);
    } catch (error) {
        toast.error("Sign up failed, please try again later");
    }
}
