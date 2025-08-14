import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../config/env";

// Define the apiService
export const repoApi = createApi({
  reducerPath: "repoApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${config.serverUrl}/api/github` }),
  endpoints: (builder) => ({
    getRepo: builder.query({
      query: (encodedRepoUrl) => `repo-files?repoUrl=${encodedRepoUrl}`,
      transformResponse: (response) => {
        // Transform the response if needed
        return response;
      },
    }),
    createPullRequest: builder.mutation({
      query: (data) => ({
        url: "/create-pr",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetRepoQuery, useCreatePullRequestMutation } = repoApi;
