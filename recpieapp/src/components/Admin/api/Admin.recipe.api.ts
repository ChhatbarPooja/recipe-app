import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'http://localhost:3000';

export const recipeApi = createApi({
  reducerPath: 'recipeApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getAllAdminRecipe: builder.query({
      query: ({ pageIndex = 1, pageSize = 10 }) =>
        `/recipe?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    }),
    getAllAdminCategory: builder.query<{ category: any[] }, void>({
      query: () => '/category',
    }),
    getAdminRecipeList: builder.mutation<any, any>({
      query: ({ id, pageIndex = 1, pageSize = 10 }) => ({
        url: `/recipe?userId=${id}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
        method: 'GET',
      }),
    }),
    getAdminRecipeByCategory: builder.mutation<any, any>({
      query: (id) => ({
          url:`/recipe?category=${id}`,
          method:'GET'
        })
      }),
    deleteAdminRecipe: builder.mutation<void, string>({
      query: (id) => ({
        url: `/recipe/${id}`,
        method: 'DELETE',
      }),
    }),
    getEditAdminRecipe: builder.mutation<any, any>({
      query: (id) => ({
        url: `/admin/recipe/${id}`,
        method: 'GET',
      }),
    }),
    updateEditAdminRecipe: builder.mutation<any,{ id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/recipe/${id}`,
        method: 'PUT',
        body: formData,
      }),
    }),
    addAdminRecipe: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: `/recipe`,
        method: 'POST',
        body: formData,
      }),
    }),
    detailsAdminRecipe: builder.query({
      query: (id) => ({
        url: `/recipe/details/${id}`,
        method: 'GET',
      }),
    }),
  }),
});
export const {
  useGetAllAdminRecipeQuery,
  useDeleteAdminRecipeMutation,
  useGetEditAdminRecipeMutation,
  useUpdateEditAdminRecipeMutation,
  useAddAdminRecipeMutation,
  useDetailsAdminRecipeQuery,
  useGetAdminRecipeListMutation,
  useGetAdminRecipeByCategoryMutation,
  useGetAllAdminCategoryQuery
} = recipeApi;
