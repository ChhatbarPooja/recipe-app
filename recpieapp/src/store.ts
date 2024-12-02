import { configureStore } from '@reduxjs/toolkit';
import { recipeApi } from './UserLayout/api/Recipe.api';
import { reviewApi } from './UserLayout/api/review.api';
import { favoriteApi } from './UserLayout/api/favorite.api';

export const store = configureStore({
  reducer: {
    [recipeApi.reducerPath]: recipeApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [favoriteApi.reducerPath]:favoriteApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(recipeApi.middleware , reviewApi.middleware, favoriteApi.middleware),
  
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
