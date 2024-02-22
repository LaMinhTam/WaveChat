import { createSlice } from "@reduxjs/toolkit";
const conversationSlice = createSlice({
    name: "conversation",
    initialState: {
        conversations: [],
        id: null,
    },
    reducers: {
        setConversations: (state, action) => {
            state.conversations = action.payload;
        },
        setId: (state, action) => {
            state.id = action.payload;
        },
    },
});
export const { setConversations, setId } = conversationSlice.actions;
export default conversationSlice.reducer;
