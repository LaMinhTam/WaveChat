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
} = commonSlice.actions;
export default commonSlice.reducer;
