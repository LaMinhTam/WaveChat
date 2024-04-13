import { createSlice } from "@reduxjs/toolkit";
const conversationSlice = createSlice({
    name: "conversation",
    initialState: {
        conversations: [],
        id: null,
        isGroupChat: false,
        listMemberOfConversation: [],
        isAdmin: false,
        isSubAdmin: false,
        linkJoinGroup: "",
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
        setListMemberOfConversation: (state, action) => {
            state.listMemberOfConversation = action.payload;
        },
        setIsAdmin: (state, action) => {
            state.isAdmin = action.payload;
        },
        setIsSubAdmin: (state, action) => {
            state.isSubAdmin = action.payload;
        },
        setLinkJoinGroup: (state, action) => {
            state.linkJoinGroup = action.payload;
        },
    },
});
export const {
    setConversations,
    setId,
    setIsGroupChat,
    setListMemberOfConversation,
    setIsAdmin,
    setIsSubAdmin,
    setLinkJoinGroup,
} = conversationSlice.actions;
export default conversationSlice.reducer;
