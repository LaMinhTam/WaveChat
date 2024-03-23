import { Link } from "react-router-dom";
import LayoutAuthentication from "../layout/LayoutAuthentication";
import FormGroup from "../components/common/FormGroup";
import Label from "../components/label";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../components/button";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/auth-context";
import { useDispatch } from "react-redux";
import { setIsResetPassword, setOpenModal } from "../store/commonSlice";

const ResetPasswordPage = () => {
    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = useForm({ resolver: yupResolver() });
    const dispatch = useDispatch();
    const { setConfirmationResult, setValues } = useAuth();
    const handleSendOTP = async (values) => {
        if (!values.phone) return;
        try {
            dispatch(setIsResetPassword(true));
            const confirmationResult = await handleSendOTP(values.phone);
            setConfirmationResult(confirmationResult);
            setValues(values);
            dispatch(setOpenModal(true));
        } catch (error) {
            toast.error(error.message);
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
            <form onSubmit={handleSubmit(handleSendOTP)}>
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
