import { createSlice } from "@reduxjs/toolkit"; //tạo ra 1 slice mới để trỏ tới slice để lấy 
//
const friendsSlice = createSlice({
    name: "friends",
    initialState: {
        openFriends: false,
    },
    reducers: {
        setOpenFiends: (state, action) => ({
            ...state,
            openFriends: action.payload,
        }),
        
    },
});
export const {
    setOpenFiends
} = friendsSlice.actions;
export default friendsSlice.reducer;