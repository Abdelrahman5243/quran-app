import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch all Ayahs
export const fetchAllAyahs = createAsyncThunk(
  "ayahs/fetchAllAyahs",
  async () => {
    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // get data from localStorage first
    const cachedData = localStorage.getItem("ayahsData");

    if (cachedData) {
      // If data in localStorage
      return JSON.parse(cachedData);
    } else {
      // If data is not in localStorage, fetch it from the server
      const response = await fetch(
        "https://api.alquran.cloud/v1/quran/ar.alafasy"
      );
      const data = await response.json();

      // Store in localStorage
      localStorage.setItem("ayahsData", JSON.stringify(data.data));

      return data.data;
    }
  }
);

const ayahsSlice = createSlice({
  name: "ayahs",
  initialState: {
    data: null,
    
    surahsIndex: 0,
    ayahsIndex: 0,
    status: "idle",
  },
  reducers: {
    setSurahsIndex: (state, action) => {
      state.surahsIndex = action.payload;
    },
    setAyahsIndex: (state, action) => {
      state.ayahsIndex = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAyahs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllAyahs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchAllAyahs.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { setSurahsIndex, setAyahsIndex } = ayahsSlice.actions;

export default ayahsSlice.reducer;
