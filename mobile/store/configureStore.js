import {configureStore, combineReducers} from '@reduxjs/toolkit';
import commonSlice from './commonSlice';

const reducer = combineReducers({
  common: commonSlice,
});

const store = configureStore({
  reducer,
});

export default store;
