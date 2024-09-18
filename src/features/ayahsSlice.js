import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const apiUrl = import.meta.env.VITE_API_URL;

// Async thunk to fetch a specific Surah
export const fetchSurah = createAsyncThunk(
  "ayahs/fetchSurah",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const surahNumber = state.ayahs.surahsIndex;
    const reader = state.ayahs.reader;

    if (!surahNumber) {
      return rejectWithValue("Invalid surah number");
    }

    try {
      const response = await fetch(`${apiUrl}/${surahNumber}/${reader}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Extract only text and audio fields
      const ayahs = data.data.ayahs.map((ayah) => ({
        text: ayah.text,
        audio: ayah.audio,
      }));

      // Update localStorage with the current surahsIndex
      localStorage.setItem("surahsIndex", surahNumber);

      return { ayahs };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const ayahsSlice = createSlice({
  name: "ayahs",
  initialState: {
    currentSurah: null,
    surahsIndex: parseInt(localStorage.getItem("surahsIndex"), 10) || 1,
    ayahsIndex: parseInt(localStorage.getItem("ayahsIndex"), 10) || 0,
    reader: localStorage.getItem("reader") || "ar.alafasy", // Default reader
    status: "idle",
    error: null,
  },
  reducers: {
    setSurahsIndex: (state, action) => {
      state.surahsIndex = action.payload;
      localStorage.setItem("surahsIndex", action.payload);
    },
    setAyahsIndex: (state, action) => {
      state.ayahsIndex = action.payload;
      localStorage.setItem("ayahsIndex", action.payload);
    },
    setReader: (state, action) => {
      state.reader = action.payload;
      localStorage.setItem("reader", action.payload);
    },
    navigate: (state, action) => {
      const { direction } = action.payload;
      const currentSurah = state.currentSurah;
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
        } else if (state.surahsIndex > 1) {
          const prevSurahIndex = state.surahsIndex - 1;
          updateIndices(prevSurahIndex, 0); // Navigate to the previous surah
        }
      } else if (direction === "right") {
        if (currentAyahIndex < (currentSurah?.ayahs.length || 0) - 1) {
          updateIndices(state.surahsIndex, currentAyahIndex + 1);
        } else if (state.surahsIndex < 114) {
          // Ensure that you don't go beyond the total number of surahs
          updateIndices(state.surahsIndex + 1, 0);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSurah.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSurah.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentSurah = action.payload;
      })
      .addCase(fetchSurah.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export const { setSurahsIndex, setAyahsIndex, setReader, navigate } =
  ayahsSlice.actions;

export default ayahsSlice.reducer;
