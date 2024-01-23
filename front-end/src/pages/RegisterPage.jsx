import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useToggleValue from "../hooks/useToggleValue";
import LayoutAuthentication from "../layout/LayoutAuthentication";
import ButtonGoogle from "../components/button/ButtonGoogle";
import { Button } from "../components/button";
import FormGroup from "../components/common/FormGroup";
import Label from "../components/label";
import Input from "../components/input/Input";
import { IconEyeToggle } from "../components/icons";
import Checkbox from "../components/checkbox";
import { handleLoginWithGoogle } from "../utils/handleLoginWithGoogle";
import PhoneInput from "react-phone-input-2";
import { auth, db } from "../utils/firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { setUser } from "../store/authSlice";
import { toast } from "react-toastify";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
// import { useSelector } from "react-redux";
import bcrypt from "bcryptjs";
import { useEffect } from "react";

const schema = yup.object({
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
});

const RegisterPage = () => {
    const {
        handleSubmit,
        control,
        formState: { isValid, errors },
        reset,
    } = useForm({ resolver: yupResolver(schema) });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSignUp = async (values) => {
        if (!isValid) return;
        try {
            let verify = new RecaptchaVerifier(
                "recaptcha-container",
                {
                    size: "invisible",
                },
                auth
            );
            const formatPh = "+" + values.phone;

            const confirmationResult = await signInWithPhoneNumber(
                auth,
                formatPh,
                verify
            );
            // get the otp code from prompt
            const otp = window.prompt("Enter OTP");
            // create credential from otp and verification id
            if (otp) {
                const credential = await confirmationResult.confirm(otp);
                // get the user
                const user = credential.user;
                dispatch(setUser(user));
                localStorage.setItem("accessToken", user.accessToken);
                const hashedPassword = await bcrypt.hash(values.password, 10);
                await setDoc(doc(db, "users", auth.currentUser.uid), {
                    id: auth.currentUser.uid,
                    name: values.name,
                    phone: values.phone,
                    password: hashedPassword,
                    avatar: "https://source.unsplash.com/random",
                    createdAt: serverTimestamp(),
                });
                toast.success("Sign up successfully");
                navigate("/");
                reset({});
            } else {
                toast.error("Sign up failed, please check your OTP code");
            }
        } catch (error) {
            toast.error("Sign up failed, please try again later");
        }
    };
    const { value: acceptTerm, handleToggleValue: handleToggleTerm } =
        useToggleValue();
    const { value: showPassword, handleToggleValue: handleTogglePassword } =
        useToggleValue();
    useEffect(() => {
        if (localStorage.getItem("accessToken")) navigate("/");
    }, [navigate]);
    return (
        <LayoutAuthentication heading="SignUp">
            <div id="recaptcha-container"></div>
            <p className="mb-6 text-xs font-normal text-center lg:mb-8 lg:text-sm text-text3">
                Already have an account?{" "}
                <Link
                    to={"/login"}
                    className="font-medium underline text-primary"
                >
                    Login
                </Link>
            </p>
            <ButtonGoogle
                text="Sign up with google"
                onClick={() => handleLoginWithGoogle(navigate, dispatch)}
            ></ButtonGoogle>
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
                                placeholder:text-text4 dark:placeholder:text-text2 dark:text-white bg-transparent"
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
                        name="term"
                        checked={acceptTerm}
                        onClick={handleToggleTerm}
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
                <Button className="w-full" kind="primary" type="submit">
                    Create my account
                </Button>
            </form>
        </LayoutAuthentication>
    );
};

export default RegisterPage;
