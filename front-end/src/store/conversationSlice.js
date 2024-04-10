import { createSlice } from "@reduxjs/toolkit";
const conversationSlice = createSlice({
    name: "conversation",
    initialState: {
        conversations: [],
        id: null,
        isGroupChat: false,
    },
    reducers: {
        setConversations: (state, action) => {
            state.conversations = action.payload;
        },
        setId: (state, action) => {
            state.id = action.payload;
        },
        setIsGroupChat: (state, action) => {
            state.isGroupChat = action.payload;
        },
    },
});
export const { setConversations, setId, setIsGroupChat } =
    conversationSlice.actions;
export default conversationSlice.reducer;
