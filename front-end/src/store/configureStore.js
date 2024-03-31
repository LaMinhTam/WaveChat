import { configureStore, combineReducers } from "@reduxjs/toolkit";
import commonSlice from "./commonSlice";
import userSlice from "./userSlice";
import chatSlice from "./chatSlice";
import conversationSlice from "./conversationSlice";
import friendSlice from "./friendSlice";

const reducer = combineReducers({
    common: commonSlice,
    user: userSlice,
    chat: chatSlice,
    conversation: conversationSlice,
    friend: friendSlice,
});

const store = configureStore({
    reducer,
});

export default store;
