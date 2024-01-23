import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import useToggleValue from "../hooks/useToggleValue";
import LayoutAuthentication from "../layout/LayoutAuthentication";
import { Button, ButtonGoogle } from "../components/button";
import FormGroup from "../components/common/FormGroup";
import Label from "../components/label";
import Input from "../components/input/Input";
import { IconEyeToggle } from "../components/icons";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { handleLoginWithGoogle } from "../utils/handleLoginWithGoogle";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebaseConfig";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { setConfirmationResult } from "../store/authSlice";
import { setOpenModal } from "../store/commonSlice";
import PhoneInput from "react-phone-input-2";

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
        reset,
        formState: { isValid, errors },
    } = useForm({ resolver: yupResolver(schema) });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isVerified = useSelector((state) => state.common.isVerified);
    const handleSignIn = async (values) => {
        if (!isValid) return;
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        const userData = userDoc.data();

        // Check the password
        const passwordIsValid = await bcrypt.compare(
            values.password,
            userData.password
        );
        if (!passwordIsValid) {
            toast.error("Password is incorrect");
        } else {
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
            dispatch(setConfirmationResult(confirmationResult));
            dispatch(setOpenModal(true));
            if (isVerified) {
                toast.success("Login successfully");
                reset({});
                navigate("/");
            }
        }
    };
    const { value: showPassword, handleToggleValue: handleTogglePassword } =
        useToggleValue();
    return (
        <LayoutAuthentication heading="Welcome Back!">
            <div id="recaptcha-container"></div>
            <p className="mb-6 text-xs font-normal text-center lg:mb-8 lg:text-sm text-text3">
                {`Don't have an account?`}{" "}
                <Link
                    to={"/register"}
                    className="font-medium underline text-primary"
                >
                    Sign up
                </Link>
            </p>
            <ButtonGoogle
                text="Sign in with google"
                onClick={() => handleLoginWithGoogle(navigate, dispatch)}
            ></ButtonGoogle>
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
                <FormGroup>
                    <div className="text-right">
                        <span className="inline-block text-sm font-medium cursor-pointer text-primary">
                            Forgot password
                        </span>
                    </div>
                </FormGroup>
                <Button kind="primary" className="w-full" type="submit">
                    Sign In
                </Button>
            </form>
        </LayoutAuthentication>
    );
};

export default LoginPage;
