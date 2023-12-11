import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import toast from 'react-hot-toast';
import { getToken } from '../utils/main';

export const productionApi = createApi({
  reducerPath: 'productionApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:5555/api/v1' }), // Adjust the base URL as needed
  prepareHeaders: (headers, { getState }) => {
        headers.set('Authorization', `Bearer ${getToken()}`)
        return headers
    },
  endpoints: (builder) => ({
    fetchProductions: builder.query({
        query: () => ({
            url: "/productions"
        }),
        providesTags: [{type: 'Production', id: 'LIST'}]
    }),
    fetchProduction: builder.query({
        query: (production_id) => ({
            url: `/productions/${production_id}`
        }),
        providesTags: (result, error, production_id) => [{ type: 'Production', id: production_id }],
    }),
    fetchPostProduction: builder.mutation({
        query: (values) => {
            return {
                url: '/productions', // POST /
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                method: 'POST',
                body: values,
            }
        },
        invalidatesTags: (result, error) => {
          if (result) {
            return [{ type: 'Production', id: 'LIST' }]
          }
          return []
        },
        transformResponse: (response, meta, arg) => {
            toast.success(`${response.title} on your stages soon!`)
            return response
        },
        transformErrorResponse: (response) => {
            toast.error(response.data.message || response.data.msg)
            return {data: response.data.message || response.data.msg}
        }
    }),
    fetchPatchProduction: builder.mutation({
        query: ({values, prodId}) => {
            return {
                url: `/productions/${prodId}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                method: 'PATCH',
                body: values,
            }
        },
        invalidatesTags: (result, error) => {
          if (result) {
            return [{ type: 'Production', id: 'LIST' }, { type: 'Production', id: result.id }]
          }
          return []
        },
        transformResponse: (response, meta, arg) => {
          
            toast.success(`${response.title} successfully updated!`)
            return response
        },
        transformErrorResponse: (response) => {
          const message = ((response.data && (response.data.message || response.data.msg)) || response.error )
          
          toast.error( message )
          return {data: message}
        }
    }),
    fetchDeleteProduction: builder.mutation({
        query: (prodId) => {
            return {
                url: `/productions/${prodId}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                method: 'DELETE',
            }
        },
        invalidatesTags: (result, error) => {
          if (result) {
            return [{ type: 'Production', id: 'LIST' }, { type: 'Production', id: result }]
          }
          return []
        },
        transformResponse: (response, meta, arg) => {
            toast.success(`Production #${arg} successfully deleted!`)
            return arg
        },
        transformErrorResponse: (response) => {
            toast.error(response.data.message || response.data.msg)
            return {data: response.data.message || response.data.msg}
        }
    }),
  }),
});

export const {
  useFetchProductionsQuery,
  useFetchProductionQuery,
  useFetchPostProductionMutation,
  useFetchPatchProductionMutation,
  useFetchDeleteProductionMutation,
} = productionApi;
