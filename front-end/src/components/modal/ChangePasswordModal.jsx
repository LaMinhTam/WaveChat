import useToggleValue from "../../hooks/useToggleValue";
import { Button } from "../button";
import FormGroup from "../common/FormGroup";
import { IconClose, IconEyeToggle } from "../icons";
import Input from "../input/Input";
import Label from "../label";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useChat } from "../../contexts/chat-context";
import { toast } from "react-toastify";
import { axiosPrivate } from "../../api/axios";
import { saveToken } from "../../utils/auth";
import { WAVE_CHAT_API } from "../../api/constants";

const schema = yup.object({
    oldPassword: yup
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

const ChangePasswordModal = () => {
    const { changePasswordModalRef, setShowChangePasswordModal } = useChat();
    const {
        handleSubmit,
        control,
        formState: { isValid, errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });
    const handleChangePassword = async (values) => {
        if (!isValid) return;
        try {
            const { oldPassword, password } = values;

            if (oldPassword === password) {
                toast.error("Mật khẩu mới không được trùng với mật khẩu cũ");
                return;
            } else {
                const res = await axiosPrivate.post(
                    WAVE_CHAT_API.changePassword(),
                    {
                        old_password: oldPassword,
                        new_password: password,
                    }
                );
                if (res.data.status === 200) {
                    toast.success("Đổi mật khẩu thành công!");
                    setShowChangePasswordModal(false);
                    saveToken(res.data.data.access_token);
                } else {
                    toast.error(res.data.message);
                }
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra");
        }
    };
    const {
        value: showOldPassword,
        handleToggleValue: handleToggleOldPassword,
    } = useToggleValue();
    const { value: showPassword, handleToggleValue: handleTogglePassword } =
        useToggleValue();
    const {
        value: showConfirmPassword,
        handleToggleValue: handleShowConfirmPassword,
    } = useToggleValue();
    return (
        <div ref={changePasswordModalRef}>
            <div className="w-[400px] h-full p-5 flex flex-col">
                <div className="flex items-center w-full h-[48px] mb-5 border-b">
                    <span className="text-[16px] font-semibold mr-auto">
                        Thay đổi mật khẩu
                    </span>
                    <button
                        onClick={() => setShowChangePasswordModal(false)}
                        className="flex items-center justify-center w-8 h-8 mb-1 rounded-full hover:bg-text3 hover:bg-opacity-10"
                    >
                        <IconClose />
                    </button>
                </div>
                <form onSubmit={handleSubmit(handleChangePassword)}>
                    <FormGroup>
                        <Label htmlFor="oldPassword">Mật khẩu cũ *</Label>
                        <Input
                            control={control}
                            type={showOldPassword ? "text" : "password"}
                            name="oldPassword"
                            placeholder="Nhập mật khẩu cũ"
                            error={errors.oldPassword?.message}
                        >
                            <IconEyeToggle
                                open={showOldPassword}
                                onClick={handleToggleOldPassword}
                            ></IconEyeToggle>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="password">Mật khẩu mới *</Label>
                        <Input
                            control={control}
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Nhập mật khẩu mới"
                            error={errors.password?.message}
                        >
                            <IconEyeToggle
                                open={showPassword}
                                onClick={handleTogglePassword}
                            ></IconEyeToggle>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="confirmPassword">
                            Xác nhận mật khẩu *
                        </Label>
                        <Input
                            control={control}
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Xác nhận mật khẩu mới"
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
            </div>
        </div>
    );
};

export default ChangePasswordModal;
