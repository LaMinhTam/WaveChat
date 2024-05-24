import { createSlice } from "@reduxjs/toolkit";
const callSlice = createSlice({
    name: "chat",
    initialState: {
        showRequestVideoCallModal: false,
        isCalled: false,
        targetUserId: "",
    },
    reducers: {
        setShowRequestVideoCallModal: (state, action) => {
            state.showRequestVideoCallModal = action.payload;
        },
        setIsCalled: (state, action) => {
            state.isCalled = action.payload;
        },
        setTargetUserId: (state, action) => {
            state.targetUserId = action.payload;
        },
    },
});
export const { setShowRequestVideoCallModal, setIsCalled, setTargetUserId } =
    callSlice.actions;
export default callSlice.reducer;
