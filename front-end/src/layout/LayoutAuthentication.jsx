/* eslint-disable react-refresh/only-export-components */
// import { useEffect } from "react";
import PropTypes from "prop-types";
// import { useNavigate } from "react-router-dom";
import { withErrorBoundary } from "react-error-boundary";
import ErrorComponent from "../components/common/ErrorComponent";
import ReactModal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModal, setOtpCode } from "../store/commonSlice";
import { Button } from "../components/button";
import Overlay from "../components/common/Overlay";
import handleVerifyOTP from "../utils/handleVerifyOTP";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
import React from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebaseConfig";
import bcrypt from "bcryptjs";
import axios from "../api/axios";

const LayoutAuthentication = ({ children, heading = "" }) => {
    const openModal = useSelector((state) => state.common.openModal);
    const otpCode = useSelector((state) => state.common.otpCode);
    const isRegister = useSelector((state) => state.common.isRegister);
    const isLogin = useSelector((state) => state.common.isLogin);
    const [isLoading, setIsLoading] = React.useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { confirmationResult, values } = useAuth();
    const handleVerify = async () => {
        setIsLoading(true);
        await handleVerifyOTP(confirmationResult, otpCode);
        if (isRegister) {
            try {
                const hashedPassword = await bcrypt.hash(values.password, 10);
                await setDoc(doc(db, "users", auth.currentUser.uid), {
                    id: auth.currentUser.uid,
                    name: values.name,
                    phone: values.phone,
                    password: hashedPassword,
                    avatar: "https://source.unsplash.com/random",
                    createdAt: serverTimestamp(),
                });
                const res = await axios.post("/auth/sign-up", {
                    full_name: values.name,
                    nick_name: values.name,
                    phone: values.phone,
                    password: values.password,
                });
                if (res.data.status === 200) {
                    const resLogin = await axios.post("/auth/sign-in", {
                        phone: values.phone,
                        password: values.password,
                    });
                    if (res.data.status === 200) {
                        localStorage.setItem(
                            "app_chat_token",
                            resLogin.data.data.access_token
                        );
                        toast.success("Sign up successfully");
                    } else {
                        toast.error(resLogin.data.data.message);
                    }
                } else {
                    toast.error(res.data.data.response.message);
                }
            } catch (error) {
                toast.error("Sign up failed, please try again later");
            }
        }
        if (isLogin) {
            try {
                const res = await axios.post("/auth/sign-in", {
                    phone: values.phone,
                    password: values.password,
                });
                if (res.data.status === 200) {
                    localStorage.setItem(
                        "app_chat_token",
                        res.data.data.access_token
                    );
                    toast.success("Sign in successfully");
                } else {
                    toast.error(res.data.data.message);
                }
            } catch (error) {
                toast.error("Sign in failed, please try again later");
            }
        }
        setIsLoading(false);
        navigate("/");
    };
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
                    type="number"
                    placeholder="Enter OTP"
                    className="w-full px-6 py-4 mt-5 text-sm font-medium bg-transparent border rounded-xl placeholder:text-text4 dark:placeholder:text-text2 dark:text-white"
                    value={otpCode}
                    onChange={(e) => dispatch(setOtpCode(e.target.value))}
                    autoFocus
                />
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
