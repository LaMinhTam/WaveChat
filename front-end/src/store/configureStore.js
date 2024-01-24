import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import commonSlice from "./commonSlice";

const reducer = combineReducers({
    auth: authSlice,
    common: commonSlice,
});

const store = configureStore({
    reducer,
});

export default store;
