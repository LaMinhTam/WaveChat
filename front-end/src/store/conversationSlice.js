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
        isConfirmNewMember: false,
        waitingList: [],
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
        setIsConfirmNewMember: (state, action) => {
            state.isConfirmNewMember = action.payload;
        },
        setWaitingList: (state, action) => {
            state.waitingList = action.payload;
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
    setIsConfirmNewMember,
    setWaitingList,
} = conversationSlice.actions;
export default conversationSlice.reducer;
