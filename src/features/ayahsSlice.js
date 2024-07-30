import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch all Ayahs
export const fetchAllAyahs = createAsyncThunk(
  "ayahs/fetchAllAyahs",
  async (_, { rejectWithValue }) => {
    try {
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
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Store in localStorage
        localStorage.setItem("ayahsData", JSON.stringify(data.data));

        return data.data;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const ayahsSlice = createSlice({
  name: "ayahs",
  initialState: {
    surahs: [],
    surahsIndex: parseInt(localStorage.getItem("surahsIndex"), 10) || 0, // Load from localStorage
    ayahsIndex: parseInt(localStorage.getItem("ayahsIndex"), 10) || 0, // Load from localStorage
    status: "idle",
    error: null,
  },
  reducers: {
    setSurahsIndex: (state, action) => {
      state.surahsIndex = action.payload;
      localStorage.setItem("surahsIndex", action.payload); // Save to localStorage
    },
    setAyahsIndex: (state, action) => {
      state.ayahsIndex = action.payload;
      localStorage.setItem("ayahsIndex", action.payload); // Save to localStorage
    },
    navigate: (state, action) => {
      const { direction } = action.payload;
      const surahs = state.surahs;
      const currentSurah = surahs[state.surahsIndex];
      const currentAyahIndex = state.ayahsIndex;

      const updateIndices = (newSurahIndex, newAyahIndex) => {
        state.surahsIndex = newSurahIndex;
        state.ayahsIndex = newAyahIndex;
        localStorage.setItem("surahsIndex", newSurahIndex);
        localStorage.setItem("ayahsIndex", newAyahIndex);
      };

      if (direction === "left") {
        if (currentAyahIndex > 0) {
          updateIndices(state.surahsIndex, currentAyahIndex - 1);
        } else if (state.surahsIndex > 0) {
          const prevSurahIndex = state.surahsIndex - 1;
          const previousSurah = surahs[prevSurahIndex];
          updateIndices(prevSurahIndex, previousSurah.ayahs.length - 1);
        }
      } else if (direction === "right") {
        if (currentAyahIndex < (currentSurah?.ayahs.length || 0) - 1) {
          updateIndices(state.surahsIndex, currentAyahIndex + 1);
        } else if (state.surahsIndex < surahs.length - 1) {
          updateIndices(state.surahsIndex + 1, 0);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAyahs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllAyahs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.surahs = action.payload.surahs;
      })
      .addCase(fetchAllAyahs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export const { setSurahsIndex, setAyahsIndex, navigate } = ayahsSlice.actions;

export default ayahsSlice.reducer;
