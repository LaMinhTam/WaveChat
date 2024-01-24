import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: undefined,
        accessToken: null,
    },
    reducers: {
        setUser: (state, action) => ({
            ...state,
            user: action.payload,
        }),
        setAccessToken: (state, action) => ({
            ...state,
            accessToken: action.payload,
        }),
    },
});
export const { setUser, setAccessToken, setConfirmationResult } =
    authSlice.actions;
export default authSlice.reducer;
