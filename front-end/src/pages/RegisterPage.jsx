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
    phone: yup.string().required("Please enter your phone number"),
    name: yup.string().required("This field is required"),
    password: yup
        .string()
        .min(8, "Your password must be at least 8 character or greater")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            {
                message:
                    "Your password must have at least with one lowercase, uppercase, digit and special character",
            }
        )
        .required("This field is required"),
    term: yup.bool().oneOf([true], "You must accept the terms and conditions"),
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
        console.log("handleSignUp ~ values:", values);
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
        <LayoutAuthentication heading="SignUp">
            <p className="mb-6 text-xs font-normal text-center lg:mb-8 lg:text-sm text-text3">
                Already have an account?{" "}
                <Link
                    to={"/login"}
                    className="font-medium underline text-primary"
                >
                    Login
                </Link>
            </p>
            <p className="mb-4 text-xs font-normal text-center lg:text-sm lg:mb-8 text-text2 dark:text-white">
                Or sign up with phone number
            </p>
            <form autoComplete="off" onSubmit={handleSubmit(handleSignUp)}>
                <FormGroup>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                        control={control}
                        type="text"
                        name="name"
                        placeholder="Jhon Doe"
                        error={errors.name?.message}
                    ></Input>
                </FormGroup>
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
                                placeholder:text-text4 dark:placeholder:text-text2 dark:text-text2"
                                buttonClass=""
                            />
                        )}
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                        control={control}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create an password"
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
                            I agree to the{" "}
                            <span className="underline cursor-pointer text-secondary">
                                Terms of Use
                            </span>{" "}
                            and have read and understand the{" "}
                            <span className="underline cursor-pointer text-secondary">
                                Privacy policy
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
                    Create my account
                </Button>
            </form>
        </LayoutAuthentication>
    );
};

export default RegisterPage;
