import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getRefreshToken, getToken, setToken } from '../utils/main';
import { toast } from 'react-hot-toast';
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:5555/api/v1' }), // Adjust the base URL as needed
  endpoints: (builder) => ({
    fetchCurrentUser: builder.query({
            async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
                // get a random user
                const meResp = await fetchWithBQ('/me')
                debugger
                if (meResp.error) { 
                    
                }
                
            },
            tagTypes: ['User'], 
        // transformResponse: (response) => {
        //     debugger
        //     setToken(response.data.jwt_token)
        //     return response.data.user
        // },
        // transformErrorResponse: (response) => {
        //     toast.error(response.data.msg)
        //     return response.data.msg   
    }),
    // fetchCurrentUser: builder.query({
    //     query: () => ({
    //         url: "/me",
    //         headers: {
    //             Authorization: `Bearer ${getToken()}`,
    //         },
    //     }),
    //     transformResponse: (response) => {
    //         debugger
    //     },
    //     transformErrorResponse: (response) => {
    //         toast.error(response.data.msg)
    //         debugger
    //         userApi.endpoints.fetchRefreshToken.initiate()
    //         return response.data.msg
    //     },
    //     tagTypes: ['User'],
    // }),
    fetchRegister: builder.mutation({
        query: (newUserData, url) => ({
            url: url, // POST /
            method: 'POST',
            body: newUserData,
        }),
        tagTypes: ['User'],
    }),
    fetchRefresh: builder.mutation({
      query: () => 'refresh', // POST /api/refresh
      // Assume you have a custom logic for handling token refresh, adjust as needed
      transformResponse: (response) => {
        if (!response.ok) {
          throw new Error('Failed to refresh token');
        }
        return response.json();
      },
    }),
  }),
});

export const {
  useFetchCurrentUserQuery,
  useFetchRegisterMutation,
  useFetchRefreshMutation,
} = userApi;
