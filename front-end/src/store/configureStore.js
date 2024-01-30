import { configureStore, combineReducers } from "@reduxjs/toolkit";
import friendSlice from "./friendSlice";

const reducer = combineReducers({
    friends: friendSlice
});

const store = configureStore({
    reducer,

});



export default store;
