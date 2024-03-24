import { toast } from "react-toastify";

export default async function handleVerifyOTP(confirmationResult, otp) {
    if (!otp) {
        toast.error("Sign up failed, OTP code is invalid");
        return false;
    }
    try {
        await confirmationResult.confirm(otp);
        return true;
    } catch (error) {
        toast.error("Mã OTP không hợp lệ! Vui lòng thử lại.");
        return false;
    }
}
