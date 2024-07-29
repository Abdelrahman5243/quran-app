import { configureStore } from '@reduxjs/toolkit';
import ayahsReducer from '../features/ayahsSlice';

export const store = configureStore({
  reducer: {
    ayahs: ayahsReducer,
  },
});

export default store;
