import { createSlice } from "@reduxjs/toolkit";
const commonSlice = createSlice({
    name: "common",
    initialState: {
        openModal: false,
        otpCode: "",
        isRegister: false,
        isLogin: false,
    },
    reducers: {
        setOpenModal: (state, action) => ({
            ...state,
            openModal: action.payload,
        }),
        setOtpCode: (state, action) => ({
            ...state,
            otpCode: action.payload,
        }),
        setIsRegister: (state, action) => ({
            ...state,
            isRegister: action.payload,
        }),
        setIsLogin: (state, action) => ({
            ...state,
            isLogin: action.payload,
        }),
    },
});
export const {
    setOpenModal,
    setOtpCode,
    setIsRegister,
    setIsLogin,
    setShowProfileDetails,
} = commonSlice.actions;
export default commonSlice.reducer;
