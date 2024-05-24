import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useToggleValue from "../hooks/useToggleValue";
import LayoutAuthentication from "../layout/LayoutAuthentication";
import { Button } from "../components/button";
import FormGroup from "../components/common/FormGroup";
import Label from "../components/label";
import Input from "../components/input/Input";
import { IconEyeToggle } from "../components/icons";
import Checkbox from "../components/checkbox";
import PhoneInput from "react-phone-input-2";
import { toast } from "react-toastify";
import { useEffect } from "react";
import handleSendOTP from "../utils/handleSendOTP";
import { setIsRegister, setOpenModal } from "../store/commonSlice";
import { useAuth } from "../contexts/auth-context";
import { getToken } from "../utils/auth";
import { isTokenExpire } from "../utils/isTokenExpire";

const schema = yup.object({
    phone: yup.string().required("Vui lòng nhập số điện thoại"),
    name: yup.string().required("Vui lòng nhập họ và tên"),
    password: yup
        .string()
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            {
                message:
                    "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký đặc biệt",
            }
        )
        .required("Vui lòng nhập mật khẩu"),
    term: yup.bool().oneOf([true], "Vui lòng đồng ý với điều khoản sử dụng"),
});

const RegisterPage = () => {
    const {
        handleSubmit,
        control,
        formState: { isValid, errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { setConfirmationResult, setValues, userInfo, loading } = useAuth();
    const handleSignUp = async (values) => {
        if (!isValid) return;
        try {
            dispatch(setIsRegister(true));
            const confirmationResult = await handleSendOTP(values.phone);
            setConfirmationResult(confirmationResult);
            setValues(values);
            dispatch(setOpenModal(true));
        } catch (error) {
            toast.error("Đăng ký thất bại! Vui lòng thử lại sau.");
        }
    };
    const { value: showPassword, handleToggleValue: handleTogglePassword } =
        useToggleValue();
    const token = getToken();
    useEffect(() => {
        if (token) {
            if (!loading && userInfo && !isTokenExpire(token)) {
                navigate("/");
            }
        }
    }, [loading, navigate, token, userInfo]);
    return (
        <LayoutAuthentication heading="Đăng ký">
            <p className="mb-6 text-xs font-normal text-center lg:mb-8 lg:text-sm text-text3">
                Bạn đã có tài khoản?{" "}
                <Link
                    to={"/login"}
                    className="font-medium underline text-primary"
                >
                    Đăng nhập ngay
                </Link>
            </p>
            <p className="mb-4 text-xs font-normal text-center lg:text-sm lg:mb-8 text-text2 dark:text-white">
                Hoặc đăng ký bằng số điện thoại
            </p>
            <form autoComplete="off" onSubmit={handleSubmit(handleSignUp)}>
                <FormGroup>
                    <Label htmlFor="name">Họ tên *</Label>
                    <Input
                        control={control}
                        type="text"
                        name="name"
                        placeholder="Jhon Doe"
                        error={errors.name?.message}
                    ></Input>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Controller
                        name="phone"
                        control={control}
                        rules={{ required: "Vui lòng nhập số điện thoại" }}
                        render={({ field }) => (
                            <PhoneInput
                                country={"vn"}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Nhập số điện thoại của bạn"
                                containerClass="relative"
                                inputClass="w-full min-w-[460px] px-6 py-4 text-sm font-medium border rounded-xl
                                placeholder:text-text4 dark:placeholder:text-text2 dark:text-text2"
                                buttonClass=""
                            />
                        )}
                    />
                    <span className="text-sm font-medium pointer-events-none text-error error-input">
                        {errors?.phone?.message}
                    </span>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="password">Mật khẩu *</Label>
                    <Input
                        control={control}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Tạo mật khẩu của bạn"
                        error={errors.password?.message}
                    >
                        <IconEyeToggle
                            open={showPassword}
                            onClick={handleTogglePassword}
                        ></IconEyeToggle>
                    </Input>
                </FormGroup>
                <div className="flex items-start mb-5 gap-x-5">
                    <Checkbox
                        control={control}
                        name="term"
                        error={errors.term?.message}
                    >
                        <p className="flex-1 text-xs lg:text-sm text-text2 dark:text-text3">
                            Tôi đồng ý với{" "}
                            <span className="underline cursor-pointer text-secondary">
                                Điều khoản sử dụng
                            </span>{" "}
                            và đã đọc và hiểu rõ{" "}
                            <span className="underline cursor-pointer text-secondary">
                                Chính sách bảo mật
                            </span>
                            .
                        </p>
                    </Checkbox>
                </div>
                <div id="recaptcha-container" className="my-2"></div>
                <Button
                    className="w-full"
                    kind="primary"
                    type="submit"
                    isLoading={isSubmitting}
                >
                    Tạo tài khoản
                </Button>
            </form>
        </LayoutAuthentication>
    );
};

export default RegisterPage;
