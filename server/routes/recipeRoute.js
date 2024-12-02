import express from "express";
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getRecipeDetails,
} from "../controllers/recipeController.js";
import uploadSingle from "../middlewares/uploadMiddleware.js";
import { likeReview } from "../controllers/likeController.js";

const recipeRoute = express.Router();

recipeRoute.post("/",uploadSingle,createRecipe);
recipeRoute.get("/", getRecipes); 
recipeRoute.get("/:id", getRecipeById);
recipeRoute.put("/:id", uploadSingle,updateRecipe);
recipeRoute.delete("/:id", deleteRecipe);
recipeRoute.post("/like", likeReview);

//get recipe details with rate and review 
recipeRoute.get("/details/:id", getRecipeDetails);

export default recipeRoute;
