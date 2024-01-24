import { createSlice } from "@reduxjs/toolkit";
const commonSlice = createSlice({
    name: "common",
    initialState: {
        openModal: false,
    },
    reducers: {
        setOpenModal: (state, action) => ({
            ...state,
            openModal: action.payload,
        }),
    },
});
export const { setOpenModal, setUserInfo, setIsVerified } = commonSlice.actions;
export default commonSlice.reducer;
