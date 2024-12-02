import express from 'express';
import { createFavorite, deleteFavoriteForUser, getFavoriteOfUser } from '../controllers/favoritController.js';

const favoriteRoute = express.Router();

// Create a new favorite
favoriteRoute.post('/',createFavorite );

// Get all favorites for a user
favoriteRoute.get('/user/:userId',getFavoriteOfUser );

// Delete a favorite
favoriteRoute.delete('/:id',deleteFavoriteForUser );

export default favoriteRoute;
