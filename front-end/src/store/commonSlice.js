import { createSlice } from "@reduxjs/toolkit";
const commonSlice = createSlice({
    name: "common",
    initialState: {
        openModal: false,
        signUpValues: {},
        isVerified: false,
    },
    reducers: {
        setOpenModal: (state, action) => ({
            ...state,
            openModal: action.payload,
        }),
        setSignUpValues: (state, action) => ({
            ...state,
            signUpValues: action.payload,
        }),
        setIsVerified: (state, action) => ({
            ...state,
            isVerified: action.payload,
        }),
    },
});
export const { setOpenModal, setSignUpValues, setIsVerified } =
    commonSlice.actions;
export default commonSlice.reducer;
