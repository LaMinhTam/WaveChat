import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
    name: "user",
    initialState: {
        userProfile: {},
        guestProfile: {},
        listFriend: [],
        friendInfo: {},
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
    },
});
export const { setUserProfile, setListFriend, setFriendInfo, setGuestProfile } =
    userSlice.actions;
export default userSlice.reducer;
