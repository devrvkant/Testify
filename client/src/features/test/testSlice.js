import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  summaries: [],
  isGenerating: false,
  error: null,
};

export const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    setTestSummaries: (state, action) => {
      state.summaries = action.payload;
      state.isGenerating = false;
      state.error = null;
    },
    addTestSummary: (state, action) => {
      const summary = action.payload;
      const existingIndex = state.summaries.findIndex(
        (s) => s.id === summary.id
      );
      if (existingIndex === -1) {
        state.summaries.push(summary);
      } else {
        state.summaries[existingIndex] = summary;
      }
    },
    removeTestSummary: (state, action) => {
      const summaryId = action.payload;
      state.summaries = state.summaries.filter(
        (summary) => summary.id !== summaryId
      );
    },
    clearTestSummaries: (state) => {
      state.summaries = [];
      state.error = null;
    },
    setGeneratingStatus: (state, action) => {
      state.isGenerating = action.payload;
    },
    setTestError: (state, action) => {
      state.error = action.payload;
      state.isGenerating = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setTestSummaries,
  addTestSummary,
  removeTestSummary,
  clearTestSummaries,
  setGeneratingStatus,
  setTestError,
} = testSlice.actions;

// Selectors
export const selectAllSummaries = (state) => state.test.summaries;
export const selectIsGenerating = (state) => state.test.isGenerating;
export const selectTestError = (state) => state.test.error;

// Selector to get a summary by testId
export const selectSummaryById = (state, testId) =>
  state.test.summaries.find((summary) => summary.id === testId);

// Memoized selector factory f
export default testSlice.reducer;
