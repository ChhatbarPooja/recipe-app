import express from "express";
import { Review } from "../models/reviewModel.js";
import {
  createReview,
  deleteReview,
  getAllReview,
  updateReview,
} from "../controllers/reviewController.js";
import { approveReview, rejectReview, getPendingReviews } from "../controllers/reviewController.js";
import { approveRecipe, getPendingRecipe, rejectRecipe } from "../controllers/recipeController.js";

const reviewRoute = express.Router();
const adminRoute = express.Router();

// Create a new review

// Get all reviews for a recipe
reviewRoute.get("/recipe/:recipeId", getAllReview);
reviewRoute.post("/", createReview);
reviewRoute.put("/:id", updateReview);
reviewRoute.delete("/:id", deleteReview);

// Update a review

// Delete a review
adminRoute.get("/review-pending", getPendingReviews);
adminRoute.put("/approve/:id", approveReview);
adminRoute.put("/reject/:id", rejectReview);

adminRoute.get("/recipe-pending", getPendingRecipe);
adminRoute.put("/approveRecipe/:id", approveRecipe);
adminRoute.delete("/rejectRecipe/:id", rejectRecipe)


export default reviewRoute;
