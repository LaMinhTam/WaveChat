import { configureStore, combineReducers } from "@reduxjs/toolkit";
import commonSlice from "./commonSlice";
import userSlice from "./userSlice";

const reducer = combineReducers({
    common: commonSlice,
    user: userSlice,
});

const store = configureStore({
    reducer,
});

export default store;
