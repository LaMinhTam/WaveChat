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
import { getToken, saveToken, saveUserId, saveUserName } from "../utils/auth";
import { isTokenExpire } from "../utils/isTokenExpire";
import axios from "../api/axios";
import { useDispatch } from "react-redux";
import { setForgotPasswordPhone } from "../store/commonSlice";

const schema = yup.object({
    phone: yup.string().required("Vui lòng nhập số điện thoại"),
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

    const dispatch = useDispatch();

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
        if (res.data.status === 200) {
            saveUserId(res.data.data?._id);
            saveToken(res.data.data?.access_token);
            saveUserName(res.data.data?.full_name);
            toast.success("Đăng nhập thành công");
            navigate("/");
        } else {
            dispatch(setForgotPasswordPhone(values?.phone));
            toast.error("Mật khẩu hoặc số điện thoại không chính xác");
        }
    };
    const { value: showPassword, handleToggleValue: handleTogglePassword } =
        useToggleValue();
    return (
        <LayoutAuthentication heading="Chào mừng trở lại!">
            <p className="mb-6 text-xs font-normal text-center lg:mb-8 lg:text-sm text-text3">
                {`Bạn chưa có tài khoản?`}{" "}
                <Link
                    to={"/register"}
                    className="font-medium underline text-primary"
                >
                    Đăng ký ngay
                </Link>
            </p>
            <form onSubmit={handleSubmit(handleSignIn)}>
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
                                placeholder:text-text4 dark:placeholder:text-text2 bg-transparent"
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
                        <Link
                            className="inline-block text-sm font-medium cursor-pointer text-primary"
                            to={"/recover"}
                        >
                            Quên mật khẩu?
                        </Link>
                    </div>
                </FormGroup>
                <Button
                    kind="primary"
                    className="w-full"
                    type="submit"
                    isLoading={isSubmitting}
                >
                    Đăng nhập
                </Button>
            </form>
        </LayoutAuthentication>
    );
};

export default LoginPage;
