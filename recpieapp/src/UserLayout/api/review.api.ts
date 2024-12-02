import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = 'http://localhost:3000';

export const reviewApi = createApi({
    reducerPath: 'reviewApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder)=>({
        editReview: builder.mutation({
            query: ({ id, reviewData }) => ({
                url: `/review/${id}`,
                method: 'PUT',
                body: reviewData,
              }),
        }),
        addReview: builder.mutation({
            query: (reviewData) => ({
              url: '/review',
              method: 'POST',
              body: reviewData,
            }),
          }),
        deleteReview:builder.mutation<any,any>({
            query:(id)=>({
                url:`/review/${id}`,
                method: 'DELETE'
            })
        })
    })
})

export const {
useEditReviewMutation,
useDeleteReviewMutation,
useAddReviewMutation
} = reviewApi