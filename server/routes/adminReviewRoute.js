import express from "express";

import { approveReview, rejectReview, getPendingReviews, pendingReview } from "../controllers/reviewController.js";
import { approveRecipe, getPendingRecipe, pendingRecipe, rejectRecipe } from "../controllers/recipeController.js";

const adminRoute = express.Router();

adminRoute.put("/approve/:id", approveReview);
adminRoute.put("/reject/:id", rejectReview);
adminRoute.get("/review-pending", getPendingReviews);
adminRoute.get("/recipe-pending", getPendingRecipe);
adminRoute.put("/approveRecipe/:id", approveRecipe);
adminRoute.delete("/rejectRecipe/:id", rejectRecipe)
adminRoute.put("/pendingRecipe/:id", pendingRecipe);
adminRoute.put("/pending/:id", pendingReview);



export default adminRoute;
