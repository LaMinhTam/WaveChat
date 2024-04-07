import { createSlice } from "@reduxjs/toolkit";
const commonSlice = createSlice({
    name: "common",
    initialState: {
        openModal: false,
        otpCode: "",
        showUpdateProfile: false,
        showUpdateAvatar: false,
        showUpdateCover: false,
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
        searchUserValue: "",
        profileType: "currentUser",
        incomingMessageOfConversation: "",
        messageShowOption: "",
        renderListBlockUser: 0,
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
        setShowUpdateCover: (state, action) => ({
            ...state,
            showUpdateCover: action.payload,
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
        setSearchUserValue: (state, action) => ({
            ...state,
            searchUserValue: action.payload,
        }),
        setProfileType: (state, action) => ({
            ...state,
            profileType: action.payload,
        }),
        setIncomingMessageOfConversation: (state, action) => ({
            ...state,
            incomingMessageOfConversation: action.payload,
        }),
        setMessageShowOption: (state, action) => ({
            ...state,
            messageShowOption: action.payload,
        }),
        setRenderListBlockUser: (state, action) => ({
            ...state,
            renderListBlockUser: action.payload,
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
    setShowUpdateCover,
    setSearchUserValue,
    setProfileType,
    setIncomingMessageOfConversation,
    setMessageShowOption,
    setRenderListBlockUser,
} = commonSlice.actions;
export default commonSlice.reducer;
