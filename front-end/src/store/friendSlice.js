import { createSlice } from "@reduxjs/toolkit";
const friendSlice = createSlice({
    name: "friend",
    initialState: {
        contactOption: 0,
        listFriendRequest: [],
        listFriendSendRequest: [],
        render: 0,
    },
    reducers: {
        setContactOption: (state, action) => {
            state.contactOption = action.payload;
        },
        setListFriendRequest: (state, action) => {
            state.listFriendRequest = action.payload;
        },
        setListFriendSendRequest: (state, action) => {
            state.listFriendSendRequest = action.payload;
        },
        setRender: (state, action) => {
            state.render = action.payload;
        },
    },
});
export const {
    setContactOption,
    setListFriendRequest,
    setListFriendSendRequest,
    setRender,
} = friendSlice.actions;
export default friendSlice.reducer;
