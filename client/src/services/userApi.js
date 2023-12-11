import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getRefreshToken, getToken, setRefreshToken, setToken } from '../utils/main';
import { toast } from 'react-hot-toast';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:5555/api/v1' }), // Adjust the base URL as needed
    prepareHeaders: (headers, { getState }) => {
        headers.set('Authorization', `Bearer ${getToken()}`)
        return headers
    },
    endpoints: (builder) => ({
        fetchCurrentUser: builder.query({
                async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
                    const meResp = await fetch('/me', {
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
                            return {data: data.user}
                        }
                        
                    }
                    return {
                        data
                    }
                    
                },
                providesTags: ['User'],
        }),
        fetchRegister: builder.mutation({
            query: ({values, url}) => {
                return {
                    url: url, // POST /
                    method: 'POST',
                    body: values,
                }
            },
            // providesTags: (result, error) => [{ type: 'User', id: result?.id }],
            providesTags: ["User"],
            transformResponse: (response, meta, arg) => {
                setToken(response.jwt_token)
                setRefreshToken(response.refresh_token)
                if (arg.url === "/login") {
                    toast.success(`Welcome back ${response.user.username}!`)
                } else {
                    toast.success(`Welcome ${response.user.username}!`)
                }
                return response.user
            },
            transformErrorResponse: (response) => {
                toast.error(response.data.message)
                return response
            }
        }),
        fetchRefresh: builder.mutation({
            query: () => ({
                url: "/refresh", // POST /
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getRefreshToken()}`,
                },
            }),
        }),
        fetchLogout: builder.mutation({
            query: () => ({}),
            invalidatesTags: ['User', 'Token'],
        }),
    }),
});

export const {
    useFetchCurrentUserQuery,
    useFetchRegisterMutation,
    useFetchRefreshMutation,
    useFetchLogoutMutation,
} = userApi;
