import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const BASE_URL = 'http://127.0.0.1:8000/';

// initialize an empty api service that we'll inject endpoints into later as needed
export const baseAPI = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
  }),
  tagTypes: [],
  endpoints: () => ({}),
});
