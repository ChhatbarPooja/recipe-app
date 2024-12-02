import mongoose from "mongoose";
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
 
  recipe_name_eng: { type: String, required: true },
  ingredients_eng: { type: String, required: true },
  recipe_steps_eng: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  num_of_people_to_served: { type: Number, required: true },
  images: { type: String, required: true },
  video_url: { type: String, required: true },
  status: { type: Boolean, required: true },
  approved: { type: Boolean, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  create_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  update_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  delete_at: { type: Date, default: null },
  delete_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

export const Recipe = mongoose.model('Recipe', RecipeSchema);


import { Recipe } from "../models/recipeModel.js";

// Create a new recipe
export const createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const createUserRecipe = async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    recipe.user_id = req.body.user_id; // Ensure the user_id is set
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Get all recipes
export const getRecipes = async (req, res) => {
  try {
    // Get the query parameters
    const { pageIndex, pageSize, category, subcategory } = req.query;

    // Create the filter object
    let filter = {};
    if (category) {
      filter.category = category;
    }
    if (subcategory) {
      filter.subcategory = subcategory;
    }

    // Parse pagination parameters
    const pageIndexInt = parseInt(pageIndex) || 1;
    const pageSizeInt = parseInt(pageSize) || 0; // 0 to fetch all if not provided

    const startIndex = (pageIndexInt - 1) * pageSizeInt;

    // Fetch the total count of recipes
    const totalRecipes = await Recipe.countDocuments(filter);

    // Fetch the filtered recipes with pagination
    const recipes = await Recipe.find(filter)
      .skip(pageSizeInt ? startIndex : 0)
      .limit(pageSizeInt);

    // Create pagination info
    const pagination = {};
    if (pageSizeInt && startIndex + pageSizeInt < totalRecipes) {
      pagination.next = {
        pageIndex: pageIndexInt + 1,
        pageSize: pageSizeInt
      };
    }
    if (pageSizeInt && startIndex > 0) {
      pagination.prev = {
        pageIndex: pageIndexInt - 1,
        pageSize: pageSizeInt
      };
    }

    // Respond with the recipes and pagination info
    res.json({
      recipes: recipes,
      pagination: pagination,
      totalRecipes: totalRecipes,
      totalPages: pageSizeInt ? Math.ceil(totalRecipes / pageSizeInt) : 1,
      currentPage: pageSizeInt ? pageIndexInt : 1
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user_id: { $exists: true } });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('category');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a recipe by ID
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a recipe by ID
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
