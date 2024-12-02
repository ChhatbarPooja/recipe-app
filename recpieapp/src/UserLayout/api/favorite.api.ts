import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'http://localhost:3000';

export const favoriteApi = createApi({
  reducerPath: 'favoriteApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    addFavorite: builder.mutation<any, { user_id: any; recipe_id: any }>({
      query: (update) => ({
        url: `/favorite`,
        method: 'POST',
        body: update,
      }),
    }),
    editFavorite: builder.mutation<any, { user_id: any; recipe_id: any }>({
      query: (update) => ({
        url: `/favorite`,
        method: 'PUT',
        body: update,
      }),
    }),
    deleteFavorite: builder.mutation<any, any>({
      query: (id) => ({
        url: `/favorite/${id}`,
        method: 'DELETE',
      }),
    }),
    getFavorites: builder.mutation({
      query: ({ user_id, pageIndex = 1, pageSize = 10 }) => ({
        url: `/favorite/user/${user_id}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        method: 'GET',
      }),
    }),
    getFavoritesId: builder.mutation<any, void>({
      query: (user_id) => ({
        url: `/favorite/user/${user_id}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useDeleteFavoriteMutation,
  useAddFavoriteMutation,
  useGetFavoritesIdMutation,
  useGetFavoritesMutation,
  useEditFavoriteMutation
} = favoriteApi;
