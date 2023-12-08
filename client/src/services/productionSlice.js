import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../utils/main';

export const productionApi = createApi({
  reducerPath: 'productionApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:5555/api/v1' }), // Adjust the base URL as needed
  endpoints: (builder) => ({
    fetchProductions: builder.query({
        query: () => ({
            url: "/productions"
        }),
    }),
  }),
});

export const {
  useFetchProductionsQuery,
} = productionApi;
