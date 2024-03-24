import { Link } from "react-router-dom";
import LayoutAuthentication from "../layout/LayoutAuthentication";
import FormGroup from "../components/common/FormGroup";
import Label from "../components/label";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import { Button } from "../components/button";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/auth-context";
import { useDispatch } from "react-redux";
import { setOpenModal } from "../store/commonSlice";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import handleSendOTP from "../utils/handleSendOTP";

const schema = yup.object({
    phone: yup.string().required("Please enter your phone number"),
});

const ResetPasswordPage = () => {
    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });
    const dispatch = useDispatch();
    const { setConfirmationResult, setValues } = useAuth();
    const handleResetPassword = async (values) => {
        if (!values.phone) return;
        try {
            const confirmationResult = await handleSendOTP(values.phone);
            console.log(
                "handleSendOTP ~ confirmationResult:",
                confirmationResult
            );
            setConfirmationResult(confirmationResult);
            setValues(values);
            dispatch(setOpenModal(true));
        } catch (error) {
            toast.error("Lỗi! Vui lòng thử lại sau.");
        }
    };
    return (
        <LayoutAuthentication heading="Reset your password">
            <p className="mb-6 text-xs font-normal text-center lg:mb-8 lg:text-sm text-text3">
                {`Go back login?`}{" "}
                <Link
                    to={"/login"}
                    className="font-medium underline text-primary"
                >
                    Login
                </Link>
            </p>
            <form onSubmit={handleSubmit(handleResetPassword)}>
                <FormGroup>
                    <Label htmlFor="phone">Phone *</Label>
                    <Controller
                        name="phone"
                        control={control}
                        rules={{ required: "Please enter your phone number" }}
                        render={({ field }) => (
                            <PhoneInput
                                country={"vn"}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Enter your phone number"
                                containerClass="relative"
                                inputClass="w-full min-w-[460px] px-6 py-4 text-sm font-medium border rounded-xl
                                placeholder:text-text4 dark:placeholder:text-text2 bg-transparent"
                            />
                        )}
                    />
                </FormGroup>
                <div id="recaptcha-container" className="my-2"></div>
                <Button
                    kind="primary"
                    className="w-full"
                    type="submit"
                    isLoading={isSubmitting}
                >
                    Send OTP
                </Button>
            </form>
        </LayoutAuthentication>
    );
};

export default ResetPasswordPage;
