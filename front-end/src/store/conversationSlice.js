import { createSlice } from "@reduxjs/toolkit";
const conversationSlice = createSlice({
    name: "conversation",
    initialState: {},
    reducers: {
        setConversations: (state, action) => {
            state.conversations = action.payload;
        },
    },
});
export const { setConversations } = conversationSlice.actions;
export default conversationSlice.reducer;
