import { configureStore, combineReducers } from "@reduxjs/toolkit";
import commonSlice from "./commonSlice";
import userSlice from "./userSlice";
import chatSlice from "./chatSlice";

const reducer = combineReducers({
    common: commonSlice,
    user: userSlice,
    chat: chatSlice,
});

const store = configureStore({
    reducer,
});

export default store;
