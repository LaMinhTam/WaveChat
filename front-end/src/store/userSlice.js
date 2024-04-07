import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
    name: "user",
    initialState: {
        userProfile: {},
        guestProfile: {},
        listFriend: [],
        friendInfo: {},
        listBlockUser: [],
    },
    reducers: {
        setUserProfile: (state, action) => ({
            ...state,
            userProfile: action.payload,
        }),
        setListFriend: (state, action) => ({
            ...state,
            listFriend: action.payload,
        }),
        setFriendInfo: (state, action) => ({
            ...state,
            friendInfo: action.payload,
        }),
        setGuestProfile: (state, action) => ({
            ...state,
            guestProfile: action.payload,
        }),
        setListBlockUser: (state, action) => ({
            ...state,
            listBlockUser: action.payload,
        }),
    },
});
export const {
    setUserProfile,
    setListFriend,
    setFriendInfo,
    setGuestProfile,
    setListBlockUser,
} = userSlice.actions;
export default userSlice.reducer;
