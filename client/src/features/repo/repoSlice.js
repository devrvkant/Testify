import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  encodedRepoUrl: "",
  repoUrl: "",
  selectedFiles: [],
};

export const repoSlice = createSlice({
  name: "repo",
  initialState,
  reducers: {
    setRepoUrl: (state, action) => {
      const repoUrl = action.payload;
      state.repoUrl = repoUrl;
      state.encodedRepoUrl = encodeURIComponent(repoUrl);
    },
    setSelectedFiles: (state, action) => {
      state.selectedFiles = action.payload;
    },
    addSelectedFile: (state, action) => {
      const file = action.payload;
      const existingIndex = state.selectedFiles.findIndex(
        (f) => f.id === file.id
      );
      if (existingIndex === -1) {
        state.selectedFiles.push(file);
      }
    },
    removeSelectedFile: (state, action) => {
      const fileId = action.payload;
      state.selectedFiles = state.selectedFiles.filter(
        (file) => file.id !== fileId
      );
    },
    clearSelectedFiles: (state) => {
      state.selectedFiles = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setRepoUrl,
  setSelectedFiles,
  addSelectedFile,
  removeSelectedFile,
  clearSelectedFiles,
} = repoSlice.actions;

export default repoSlice.reducer;
