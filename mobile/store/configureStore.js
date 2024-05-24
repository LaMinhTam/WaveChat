import {configureStore, combineReducers} from '@reduxjs/toolkit';
import commonSlice from './commonSlice';
import chatSlice from './chatSlice';

const reducer = combineReducers({
  common: commonSlice,
  chatSlide: chatSlice,
});

const store = configureStore({
  reducer,
});

export default store;
