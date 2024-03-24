import { createSlice } from "@reduxjs/toolkit";
const commonSlice = createSlice({
    name: "common",
    initialState: {
        openModal: false,
        otpCode: "",
        showUpdateProfile: false,
        showUpdateAvatar: false,
        showConversation: false,
        activeConversation: "",
        showConversationInfo: false,
        showStorage: false,
        storageOption: "image",
        progress: 0,
        currentFileName: "",
        isRegister: false,
        isVerify: false,
        setIsVerify: false,
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
        setActiveConversation: (state, action) => ({
            ...state,
            activeConversation: action.payload,
        }),
        setShowConversationInfo: (state, action) => ({
            ...state,
            showConversationInfo: action.payload,
        }),
        setShowStorage: (state, action) => ({
            ...state,
            showStorage: action.payload,
        }),
        setStorageOption: (state, action) => ({
            ...state,
            storageOption: action.payload,
        }),
        setProgress: (state, action) => ({
            ...state,
            progress: action.payload,
        }),
        setCurrentFileName: (state, action) => ({
            ...state,
            currentFileName: action.payload,
        }),
        setIsRegister: (state, action) => ({
            ...state,
            isRegister: action.payload,
        }),
        setIsVerify: (state, action) => ({
            ...state,
            isVerify: action.payload,
        }),
    },
});
export const {
    setOpenModal,
    setOtpCode,
    setShowUpdateProfile,
    setShowUpdateAvatar,
    setShowConversation,
    setActiveConversation,
    setShowConversationInfo,
    setShowStorage,
    setStorageOption,
    setProgress,
    setCurrentFileName,
    setIsRegister,
    setIsVerify,
} = commonSlice.actions;
export default commonSlice.reducer;
