import { Link, useNavigate } from "react-router-dom";
import LayoutAuthentication from "../layout/LayoutAuthentication";
import FormGroup from "../components/common/FormGroup";
import Label from "../components/label";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../components/input/Input";
import useToggleValue from "../hooks/useToggleValue";
import { IconEyeToggle } from "../components/icons";
import { Button } from "../components/button";
import { auth } from "../utils/firebaseConfig";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/auth-context";

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
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match"),
});
const ChangePasswordPage = () => {
    const {
        handleSubmit,
        control,
        formState: { isValid, errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });
    const navigate = useNavigate();
    const { values: newValues } = useAuth();
    const handleChangePassword = async (values) => {
        if (!isValid) return;
        try {
            const user = auth.currentUser;
            if (user) {
                await user.updatePassword(values.password);
                var newPhone = newValues.phone;
                if (values.phone.length === 12) {
                    newPhone = values.phone.slice(2);
                }
                if (values.phone.length === 11) {
                    newPhone = `0${values.phone.slice(2)}`;
                }
                toast.success("Password changed successfully");
                navigate("/login");
            } else {
                throw new Error("User not found");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };
    const { value: showPassword, handleToggleValue: handleTogglePassword } =
        useToggleValue();
    const {
        value: showConfirmPassword,
        handleToggleValue: handleShowConfirmPassword,
    } = useToggleValue();
    return (
        <LayoutAuthentication heading="Change your password">
            <p className="mb-6 text-xs font-normal text-center lg:mb-8 lg:text-sm text-text3">
                {`Go back login?`}{" "}
                <Link
                    to={"/login"}
                    className="font-medium underline text-primary"
                >
                    Login
                </Link>
            </p>
            <form onSubmit={handleSubmit(handleChangePassword)}>
                <FormGroup>
                    <Label htmlFor="password">New Password *</Label>
                    <Input
                        control={control}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your new password"
                        error={errors.password?.message}
                    >
                        <IconEyeToggle
                            open={showPassword}
                            onClick={handleTogglePassword}
                        ></IconEyeToggle>
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                        control={control}
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Enter your new password"
                        error={errors.confirmPassword?.message}
                    >
                        <IconEyeToggle
                            open={showConfirmPassword}
                            onClick={handleShowConfirmPassword}
                        ></IconEyeToggle>
                    </Input>
                </FormGroup>
                <Button
                    kind="primary"
                    className="w-full"
                    type="submit"
                    isLoading={isSubmitting}
                >
                    Change Password
                </Button>
            </form>
        </LayoutAuthentication>
    );
};

export default ChangePasswordPage;
