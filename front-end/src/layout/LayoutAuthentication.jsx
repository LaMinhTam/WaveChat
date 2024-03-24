/* eslint-disable react-refresh/only-export-components */
// import { useEffect } from "react";
import PropTypes from "prop-types";
// import { useNavigate } from "react-router-dom";
import { withErrorBoundary } from "react-error-boundary";
import ErrorComponent from "../components/common/ErrorComponent";
import ReactModal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { setIsVerify, setOpenModal, setOtpCode } from "../store/commonSlice";
import { Button } from "../components/button";
import Overlay from "../components/common/Overlay";
import handleVerifyOTP from "../utils/handleVerifyOTP";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
import React, { useEffect, useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebaseConfig";
import bcrypt from "bcryptjs";
import axios from "../api/axios";
import { saveToken, saveUserId } from "../utils/auth";
import handleSendOTP from "../utils/handleSendOTP";

const LayoutAuthentication = ({ children, heading = "" }) => {
    const isRegister = useSelector((state) => state.common.isRegister);
    const [countdown, setCountdown] = useState(60);
    const openModal = useSelector((state) => state.common.openModal);
    const otpCode = useSelector((state) => state.common.otpCode);
    const [isLoading, setIsLoading] = React.useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { confirmationResult, values, setConfirmationResult } = useAuth();

    // add function onEnter to run handleVerify
    const onEnter = async (e) => {
        if (e.key === "Enter" && otpCode.length > 0) {
            await handleVerify();
        }
    };

    const resendOTP = async () => {
        const confirmationResult = await handleSendOTP(
            values.phone,
            "recaptcha-id"
        );
        setConfirmationResult(confirmationResult);
        toast.success("Đã gửi lại mã OTP!");
        setCountdown(60);
    };

    const handleVerify = async () => {
        const otpRegex = /^\d{6}$/;
        if (otpRegex.test(otpCode)) {
            setIsLoading(true);
            const isValid = await handleVerifyOTP(confirmationResult, otpCode);
            if (isValid) {
                if (isRegister) {
                    try {
                        let newPhone = values.phone;
                        if (values.phone.length === 12) {
                            newPhone = values.phone.slice(2);
                        }
                        if (values.phone.length === 11) {
                            newPhone = `0${values.phone.slice(2)}`;
                        }
                        const hashedPassword = await bcrypt.hash(
                            values.password,
                            10
                        );
                        await setDoc(doc(db, "users", auth.currentUser.uid), {
                            id: auth.currentUser.uid,
                            name: values.name,
                            phone: newPhone,
                            password: hashedPassword,
                            avatar: "https://source.unsplash.com/random",
                            createdAt: serverTimestamp(),
                        });
                        const res = await axios.post("/auth/sign-up", {
                            full_name: values.name,
                            nick_name: values.name,
                            phone: newPhone,
                            password: values.password,
                        });
                        if (res.data.status === 200) {
                            const resLogin = await axios.post("/auth/sign-in", {
                                phone: newPhone,
                                password: values.password,
                            });
                            if (res.data.status === 200) {
                                saveUserId(resLogin.data.data._id);
                                saveToken(resLogin.data.data.access_token);
                                toast.success("Đăng ký thành công");
                                setIsLoading(false);
                                navigate("/");
                            } else {
                                toast.error(resLogin.data.data.message);
                            }
                        } else {
                            setIsLoading(false);
                            dispatch(setOpenModal(false));
                            toast.error(res.data.data.response.message);
                        }
                    } catch (error) {
                        setIsLoading(false);
                        dispatch(setOpenModal(false));
                        toast.error("Đăng ký thất bại! Vui lòng thử lại sau.");
                    }
                } else {
                    dispatch(setIsVerify(true));
                    navigate(`/recover/change-password`);
                    toast.success("Xác thực thành công!");
                    dispatch(setOpenModal(false));
                }
            } else {
                setIsLoading(false);
            }
        } else {
            toast.error("Mã OTP phải là 6 chữ số!");
        }
    };

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);
    return (
        <>
            <ReactModal
                isOpen={openModal}
                overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-40 z-50
                    flex justify-center items-center"
                className="modal-content w-full max-w-[521px] bg-white rounded-2xl outline-none p-10 relative max-h-[90vh] overflow-y-auto scroll-hidden"
            >
                <button
                    onClick={() => dispatch(setOpenModal(false))}
                    className="absolute z-10 flex items-center justify-center cursor-pointer w-11 h-11 right-10 top-[10px] text-text1"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full px-6 py-4 mt-5 text-sm font-medium bg-transparent border rounded-xl placeholder:text-text4 dark:placeholder:text-text2 dark:text-white"
                    value={otpCode}
                    onChange={(e) => dispatch(setOtpCode(e.target.value))}
                    autoFocus
                    onKeyDown={onEnter}
                />
                <p className="mt-3 text-sm font-normal text-text3 dark:text-white">
                    {"Didn't receive the code?"}{" "}
                    {countdown > 0 ? (
                        <span>{`Resend available in ${countdown} seconds`}</span>
                    ) : (
                        <span
                            className="cursor-pointer text-primary hover:underline"
                            onClick={resendOTP}
                        >
                            Resend
                        </span>
                    )}
                </p>
                <div id="recaptcha-id" className="my-2"></div>
                <Button
                    kind="primary"
                    className="w-[100px] mx-auto mt-5"
                    onClick={handleVerify}
                    isLoading={isLoading}
                >
                    Verify
                </Button>
            </ReactModal>
            <Overlay></Overlay>
            <div className="relative w-full min-h-screen p-10 bg-lite dark:bg-darkBG isolate">
                <img
                    src="/background.png"
                    alt="background"
                    className="hidden lg:block w-full pointer-events-none absolute top-0 bottom-0 left-0 right-0 z-[-1]"
                />
                <h1 className="mb-5 text-5xl font-extrabold text-center text-thirdly">
                    Wave Chat
                </h1>
                <div className="w-full max-w-[556px] bg-white dark:bg-darkSecondary rounded-xl px-5 py-8 lg:px-12 lg:py-16 mx-auto">
                    <h2 className="mb-1 text-lg font-semibold text-center lg:text-xl lg:mb-3 dark:text-white">
                        {heading}
                    </h2>
                    {children}
                </div>
            </div>
        </>
    );
};

LayoutAuthentication.propTypes = {
    children: PropTypes.node,
    heading: PropTypes.string,
};

export default withErrorBoundary(LayoutAuthentication, {
    FallbackComponent: ErrorComponent,
});
