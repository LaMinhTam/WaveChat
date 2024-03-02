import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
    name: "user",
    initialState: {
        userProfile: {},
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
    },
});
export const { setUserProfile, setListFriend, setFriendInfo } =
    userSlice.actions;
export default userSlice.reducer;