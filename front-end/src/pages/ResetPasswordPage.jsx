import { Link, useNavigate } from "react-router-dom";
import LayoutAuthentication from "../layout/LayoutAuthentication";
import FormGroup from "../components/common/FormGroup";
import Label from "../components/label";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import { Button } from "../components/button";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/auth-context";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModal, setOtpCode } from "../store/commonSlice";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import handleSendOTP from "../utils/handleSendOTP";
import { useEffect } from "react";
import { getToken } from "../utils/auth";

const schema = yup.object({
    phone: yup.string().required("Vui lòng nhập số điện thoại"),
});

const ResetPasswordPage = () => {
    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });
    const dispatch = useDispatch();
    const forgotPasswordPhone = useSelector(
        (state) => state.common.forgotPasswordPhone
    );
    const { setConfirmationResult, setValues } = useAuth();
    const handleResetPassword = async (values) => {
        if (!values.phone) return;
        try {
            dispatch(setOtpCode(""));
            const confirmationResult = await handleSendOTP(values.phone);
            setConfirmationResult(confirmationResult);
            setValues(values);
            dispatch(setOpenModal(true));
        } catch (error) {
            toast.error("Lỗi! Vui lòng thử lại sau.");
        }
    };
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
        if (token) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <LayoutAuthentication heading="Đặt lại mật khẩu">
            <p className="mb-6 text-xs font-normal text-center lg:mb-8 lg:text-sm text-text3">
                {`Quay lại đăng nhập?`}{" "}
                <Link
                    to={"/login"}
                    className="font-medium underline text-primary"
                >
                    Đăng nhập
                </Link>
            </p>
            <form onSubmit={handleSubmit(handleResetPassword)}>
                <FormGroup>
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Controller
                        defaultValue={forgotPasswordPhone ?? ""}
                        name="phone"
                        control={control}
                        rules={{ required: "Vui lòng nhập số điện thoại" }}
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
                    Gửi mã xác nhận
                </Button>
            </form>
        </LayoutAuthentication>
    );
};

export default ResetPasswordPage;
