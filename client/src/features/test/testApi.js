import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../config/env";
import {
  setTestSummaries,
  setGeneratingStatus,
  setTestError,
} from "./testSlice";

// Define the apiService
export const testApi = createApi({
  reducerPath: "testApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${config.serverUrl}/api/testcase` }),
  endpoints: (builder) => ({
    generateTestSummaries: builder.mutation({
      query: (data) => ({
        url: "/summaries",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // Set loading state
        dispatch(setGeneratingStatus(true));

        try {
          const { data } = await queryFulfilled;
          // Set the test summaries in the slice when API call succeeds
          dispatch(setTestSummaries(data.summaries || []));
        } catch (error) {
          // Handle error state
          dispatch(
            setTestError(
              error.error?.data?.error || "Failed to generate test summaries"
            )
          );
        }
      },
    }),
    generateTestCaseCode: builder.mutation({
      query: (data) => ({
        url: "/generate",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGenerateTestSummariesMutation, useGenerateTestCaseCodeMutation } = testApi;
