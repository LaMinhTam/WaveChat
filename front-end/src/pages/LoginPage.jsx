import { Controller, useForm } from "react-hook-form";
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
import { useAuth } from "../contexts/auth-context";
import { getToken, saveToken, saveUserId } from "../utils/auth";
import { isTokenExpire } from "../utils/isTokenExpire";
import axios from "../api/axios";

const schema = yup.object({
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
});

const LoginPage = () => {
    const {
        handleSubmit,
        control,
        formState: { isValid, errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });
    const navigate = useNavigate();
    const { userInfo, loading } = useAuth();
    const token = getToken();

    useEffect(() => {
        if (token) {
            if (!loading && !isTokenExpire(token)) {
                navigate("/");
            }
        }
    }, [loading, navigate, token, userInfo]);
    const handleSignIn = async (values) => {
        if (!isValid) return;
        let newPhone = values.phone;
        if (values.phone.length === 12) {
            newPhone = values.phone.slice(2);
        }
        if (values.phone.length === 11) {
            newPhone = `0${values.phone.slice(2)}`;
        }
        const res = await axios.post("/auth/sign-in", {
            phone: newPhone,
            password: values.password,
        });
        console.log("handleSignIn ~ res:", res);
        if (res.data.status === 200) {
            saveUserId(res.data.data?._id);
            saveToken(res.data.data?.access_token);
            toast.success("Sign in successfully");
            navigate("/");
        } else {
            toast.error("Mật khẩu hoặc số điện thoại không chính xác");
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
