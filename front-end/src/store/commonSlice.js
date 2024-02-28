import { createSlice } from "@reduxjs/toolkit";
const commonSlice = createSlice({
    name: "common",
    initialState: {
        openModal: false,
        otpCode: "",
        isRegister: false,
        isLogin: false,
        showUpdateProfile: false,
        showUpdateAvatar: false,
        showConversation: false,
        activeName: "",
        currentUserName: "",
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
        setShowUpdateProfile: (state, action) => ({
            ...state,
            showUpdateProfile: action.payload,
        }),
        setShowUpdateAvatar: (state, action) => ({
            ...state,
            showUpdateAvatar: action.payload,
        }),
        setShowConversation: (state, action) => ({
            ...state,
            showConversation: action.payload,
        }),
        setActiveName: (state, action) => ({
            ...state,
            activeName: action.payload,
        }),
        setCurrentUserName: (state, action) => ({
            ...state,
            currentUserName: action.payload,
        }),
    },
});
export const {
    setOpenModal,
    setOtpCode,
    setIsRegister,
    setIsLogin,
    setShowUpdateProfile,
    setShowUpdateAvatar,
    setShowConversation,
    setActiveName,
    setCurrentUserName,
} = commonSlice.actions;
export default commonSlice.reducer;
