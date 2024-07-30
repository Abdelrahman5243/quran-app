import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch all Ayahs
export const fetchAllAyahs = createAsyncThunk(
  "ayahs/fetchAllAyahs",
  async () => {
    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get data from localStorage first
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
    surahs: [],
    surahsIndex: 0, // Index of the selected surah
    ayahsIndex: 0, // Index of the selected ayah
    status: "idle",
  },
  reducers: {
    setSurahsIndex: (state, action) => {
      state.surahsIndex = action.payload;
    },
    setAyahsIndex: (state, action) => {
      state.ayahsIndex = action.payload;
    },
    navigate: (state, action) => {
      const { direction } = action.payload;
      const surahs = state.surahs;
      const currentSurah = surahs[state.surahsIndex];
      const currentAyahIndex = state.ayahsIndex;

      if (direction === "left") {
        if (currentAyahIndex > 0) {
          state.ayahsIndex = currentAyahIndex - 1;
        } else if (state.surahsIndex > 0) {
          state.surahsIndex = state.surahsIndex - 1;
          const previousSurah = surahs[state.surahsIndex];
          if (previousSurah) {
            state.ayahsIndex = previousSurah.ayahs.length - 1;
          }
        }
      } else if (direction === "right") {
        if (currentAyahIndex < (currentSurah?.ayahs.length || 0) - 1) {
          state.ayahsIndex = currentAyahIndex + 1;
        } else if (state.surahsIndex < surahs.length - 1) {
          state.surahsIndex = state.surahsIndex + 1;
          state.ayahsIndex = 0;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAyahs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllAyahs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.surahs = action.payload.surahs;
      })
      .addCase(fetchAllAyahs.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { setSurahsIndex, setAyahsIndex, navigate } = ayahsSlice.actions;

export default ayahsSlice.reducer;
