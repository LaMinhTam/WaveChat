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
import { toast } from "react-toastify";
import { useAuth } from "../contexts/auth-context";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../api/axios";

const schema = yup.object({
    password: yup
        .string()
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            {
                message:
                    "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt",
            }
        )
        .required("Vui lòng nhập mật khẩu"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Mật khẩu không khớp"),
});
const ChangePasswordPage = () => {
    const {
        handleSubmit,
        control,
        formState: { isValid, errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });
    const navigate = useNavigate();
    const isVerify = useSelector((state) => state.common.isVerify);
    const { values: newValues } = useAuth();
    const handleChangePassword = async (values) => {
        if (!isValid) return;
        try {
            let newPhone = newValues.phone;
            if (newValues.phone?.length === 12) {
                newPhone = newValues.phone.slice(2);
            }
            if (newValues.phone?.length === 11) {
                newPhone = `0${newValues.phone.slice(2)}`;
            }
            const res = await axios.post("/auth/reset-password", {
                phone: newPhone,
                password: values.password,
            });
            if (res.data.status === 200) {
                toast.success("Đặt lại mật khẩu thành công!");
                navigate("/login");
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

    useEffect(() => {
        if (!isVerify) {
            navigate("/recover");
        }
    }, [isVerify, navigate]);
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
            <form onSubmit={handleSubmit(handleChangePassword)}>
                <FormGroup>
                    <Label htmlFor="password">Mật khẩu mới *</Label>
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
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu *</Label>
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
                    Xác nhận
                </Button>
            </form>
        </LayoutAuthentication>
    );
};

export default ChangePasswordPage;
