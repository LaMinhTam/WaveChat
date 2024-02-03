import { createSlice } from "@reduxjs/toolkit";
const chatSlice = createSlice({
    name: "chat",
    initialState: {
        currentTab: "Chat",
        message: "",
    },
    reducers: {
        setCurrentTab: (state, action) => {
            state.currentTab = action.payload;
        },
        setMessage: (state, action) => {
            state.message = action.payload;
        },
    },
});
export const { setCurrentTab, setMessage } = chatSlice.actions;
export default chatSlice.reducer;
