import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getRefreshToken, getToken, setRefreshToken, setToken } from '../utils/main';
import { toast } from 'react-hot-toast';
export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:5555/api/v1' }), // Adjust the base URL as needed
    prepareHeaders: (headers, { getState }) => {
        headers.set('Authorization', `Bearer ${getToken()}`)
        return headers
    },
    endpoints: (builder) => ({
        fetchTokens: builder.mutation({
            async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
                const meResp = await fetch('/check', {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        "Content-Type": "application/json",
                    },
                })
                const data = await meResp.json()
                if (data?.msg) {
                    const refreshResp = await fetch("/refresh", {
                        method: "POST",
                        headers: {
                            //! NOTICE HERE I send the refresh token since I know the access token is expired
                            "Authorization": `Bearer ${getRefreshToken()}`,
                            "Content-Type": "application/json"
                        }
                    })
                    const data = await refreshResp.json()
                    if (data?.msg) {
                        if (data.msg === "Not enough segments") {
                            toast("Your tokens have expired", {
                                icon: "🔑",
                                style: {
                                    borderRadius: '10px',
                                    background: '#ffcc00',
                                    color: '#000',
                                },
                            })
                        } else {
                            toast.error(data.msg)
                        }
                        return {error: data.msg}
                    } else {
                        setToken(data.jwt_token)
                        return {data: data.jwt_token}
                    } 
                }
                return {
                    data
                }
                
            },
            // providesTags: (result, error) => [{ type: 'User', id: result?.id }],
            providesTags: ['Token'],
        }),
    })
});

export const {
    useFetchCheckQuery,
    useFetchRefreshMutation,
    useFetchTokensMutation
} = authApi;
