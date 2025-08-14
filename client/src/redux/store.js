import { configureStore } from "@reduxjs/toolkit";

import repoReducer from "../features/repo/repoSlice";
import testReducer from "../features/test/testSlice";
import { repoApi } from "../features/repo/repoApi";
import { testApi } from "../features/test/testApi";

export const store = configureStore({
  reducer: {
    repo: repoReducer,
    test: testReducer,
    [repoApi.reducerPath]: repoApi.reducer,
    [testApi.reducerPath]: testApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(repoApi.middleware, testApi.middleware),
});
