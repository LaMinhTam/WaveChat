import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import useToggleValue from "../hooks/useToggleValue";
import LayoutAuthentication from "../layout/LayoutAuthentication";
import { Button } from "../components/button";
import FormGroup from "../components/common/FormGroup";
import Label from "../components/label";
import Input from "../components/input/Input";
import { IconEyeToggle } from "../components/icons";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import { useEffect } from "react";
import handleSendOTP from "../utils/handleSendOTP";
import { setIsLogin, setOpenModal } from "../store/commonSlice";
import { useAuth } from "../contexts/auth-context";
import { getToken } from "../utils/auth";
import { isTokenExpire } from "../utils/isTokenExpire";

const schema = yup.object({
    password: yup
        .string()
        // .min(8, "Your password must be at least 8 character or greater")
        // .matches(
        //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        //     {
        //         message:
        //             "Your password must have at least with one lowercase, uppercase, digit and special character",
        //     }
        // )
        .required("This field is required"),
});

const LoginPage = () => {
    const {
        handleSubmit,
        control,
        formState: { isValid, errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { setConfirmationResult, userInfo, setValues, loading } = useAuth();
    const token = getToken();

    useEffect(() => {
        if (token) {
            if (!loading && userInfo && !isTokenExpire(token)) {
                navigate("/");
            }
        }
    }, [loading, navigate, token, userInfo]);
    const handleSignIn = async (values) => {
        if (!isValid) return;
        try {
            const confirmationResult = true
            setConfirmationResult(confirmationResult);
            dispatch(setIsLogin(true));
            setValues({
                name: "",
                phone: values.phone,
                password: values.password,
            });
            dispatch(setOpenModal(true));
        } catch (error) {
            toast.error(error);
        }
    };
    const { value: showPassword, handleToggleValue: handleTogglePassword } =
        useToggleValue();
    return (
        <LayoutAuthentication heading="Welcome Back!">
            <p className="mb-6 text-xs font-normal text-center lg:mb-8 lg:text-sm text-text3">
                {`Don't have an account?`}{" "}
                <Link
                    to={"/register"}
                    className="font-medium underline text-primary"
                >
                    Sign up
                </Link>
            </p>
            <form onSubmit={handleSubmit(handleSignIn)}>
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
                <FormGroup>
                    <div className="text-right">
                        <span className="inline-block text-sm font-medium cursor-pointer text-primary">
                            Forgot password
                        </span>
                    </div>
                </FormGroup>
                <div id="recaptcha-container" className="my-2"></div>
                <Button
                    kind="primary"
                    className="w-full"
                    type="submit"
                    isLoading={isSubmitting}
                >
                    Sign In
                </Button>
            </form>
        </LayoutAuthentication>
    );
};

export default LoginPage;
