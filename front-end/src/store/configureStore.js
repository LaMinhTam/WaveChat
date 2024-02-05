import { configureStore, combineReducers } from "@reduxjs/toolkit";
import commonSlice from "./commonSlice";
import userSlice from "./userSlice";
import chatSlice from "./chatSlice";
import conversationSlice from "./conversationSlice";

const reducer = combineReducers({
    common: commonSlice,
    user: userSlice,
    chat: chatSlice,
    conversation: conversationSlice,
});

const store = configureStore({
    reducer,
});

export default store;
