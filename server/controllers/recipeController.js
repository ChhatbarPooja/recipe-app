import { Recipe } from "../models/recipeModel.js";
import { Review } from "../models/reviewModel.js";
import { Category } from "../models/categoryModel.js";
import mongoose from 'mongoose'
import { Like } from "../models/likeModel.js";
export const createRecipe = async (req, res) => {
  try {
    const {
      recipe_name_eng,
      recipe_name_hindi,
      recipe_name_guj,
      ingredients_eng,
      ingredients_hindi,
      ingredients_guj,
      recipe_steps_eng,
      recipe_steps_hindi,
      recipe_steps_guj,
      category,
      num_of_people_to_served,
      cooking_time,
      preparation_time,
      difficulty_level,
      video_url,
      status,
      create_by,
      approved
    } = req.body;
    const images = req.file ? req.file.path : "";

    if (

      !category ||
      !num_of_people_to_served
    ) {
      return res
        .status(400)
        .json({ message: "English fields must be provided" });
    }

    const newRecipe = new Recipe({
      recipe_name_eng,
      recipe_name_hindi,
      recipe_name_guj,
      ingredients_eng,
      ingredients_hindi,
      ingredients_guj,
      recipe_steps_eng,
      recipe_steps_hindi,
      recipe_steps_guj,
      category,
      num_of_people_to_served,
      cooking_time,
      preparation_time,
      difficulty_level,
      images,
      video_url,
      status,
      create_by,
      approved
    });

    const savedRecipe = await newRecipe.save();

    notifyAdminAboutNewRecipe(savedRecipe);

    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    res
      .status(500)
      .json({ message: "Failed to create recipe", error: error.message });
  }
};

const notifyAdminAboutNewRecipe = (recipe) => {
  console.log("Admin notification: A new recipe has been submitted and is awaiting review:", recipe);
};

export const getRecipes = async (req, res) => {
  try {
    const { pageIndex = 1, pageSize = 10, category, userId, search } = req.query;
    let filter = { status: 'approved' };

    // Add category filter
    if (category) {
      const categoryIds = [new mongoose.Types.ObjectId(category)];
      const subcategoryIds = await getSubcategoryIds(new mongoose.Types.ObjectId(category));
      subcategoryIds.forEach(id => categoryIds.push(new mongoose.Types.ObjectId(id)));

      filter.category = { $in: categoryIds };
    }

    // Add user filter
    if (userId) {
      filter.create_by = new mongoose.Types.ObjectId(userId);
    }

    // Add search filter
    if (search) {
      filter.recipe_name_eng = { $regex: search, $options: "i" };
    }

    const pageIndexInt = parseInt(pageIndex, 10);
    const pageSizeInt = parseInt(pageSize, 10);

    // Handle pagination
    const startIndex = (pageIndexInt - 1) * pageSizeInt;
    const totalRecipes = await Recipe.countDocuments(filter);

    if (totalRecipes === 0) {
      return res.json({
        recipes: [],
        totalRecipes: 0,
        totalPages: 0,
        currentPage: pageIndexInt,
      });
    }

    const recipes = await Recipe.find(filter)
      .skip(pageSizeInt ? startIndex : 0)
      .limit(pageSizeInt || 0);

    const pagination = {};
    if (pageSizeInt && startIndex + pageSizeInt < totalRecipes) {
      pagination.next = {
        pageIndex: pageIndexInt + 1,
        pageSize: pageSizeInt,
      };
    }
    if (pageSizeInt && startIndex > 0) {
      pagination.prev = {
        pageIndex: pageIndexInt - 1,
        pageSize: pageSizeInt,
      };
    }

    const recipeIds = recipes.map(recipe => recipe._id);
    const reviews = await Review.find({ recipe_id: { $in: recipeIds } })
      .populate("user_id")
      .lean();

    const reviewMap = {};
    reviews.forEach(review => {
      if (!reviewMap[review.recipe_id]) {
        reviewMap[review.recipe_id] = [];
      }
      reviewMap[review.recipe_id].push(review);
    });

    const recipesWithReviews = recipes.map(recipe => ({
      ...recipe.toObject(),
      reviews: reviewMap[recipe._id] || [],
    }));

    res.json({
      recipes: recipesWithReviews,
      pagination: pagination,
      totalRecipes: totalRecipes,
      totalPages: pageSizeInt ? Math.ceil(totalRecipes / pageSizeInt) : 1,
      currentPage: pageSizeInt ? pageIndexInt : 1,
    });
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ message: "Failed to fetch recipes", error: err.message });
  }
};

async function getSubcategoryIds(categoryId) {
  let subcategoryIds = [];
  const subcategories = await Category.find({ 'subcategory': categoryId });

  for (const subcategory of subcategories) {
    subcategoryIds.push(subcategory._id.toString());
    const subSubcategoryIds = await getSubcategoryIds(subcategory._id);
    subcategoryIds = subcategoryIds.concat(subSubcategoryIds);
  }

  return subcategoryIds;
}


// Get a recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate({
        path: 'category',
        select: '_id name'
      })
      .lean();

    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const reviews = await Review.find({ recipe_id: req.params.id })
      .populate({
        path: 'user_id',
        select: '_id name'
      })
      .select('review rating -_id')
      .lean();

    recipe.reviews = reviews;
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a recipe by ID
export const updateRecipe = async (req, res) => {
  try {
    const images = req.file ? req.file.path : "";
    const updatedFields = {
      ...req.body,
    };

    if (images) {
      updatedFields.images = images;
    }

    console.log(updatedFields);
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id, 
      { $set: updatedFields },
      { new: true }
    );

    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    res.json(recipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Delete a recipe by ID
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Get recipe details by id
export const getRecipeDetails = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).lean();
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const reviews = await Review.find({ recipe_id: req.params.id })
      .populate("user_id", "user_name")
      .lean();

    const reviewIds = reviews.map(review => review._id);
    const likes = await Like.find({ review_id: { $in: reviewIds } }).lean();

    const reviewsWithLikes = reviews.map(review => {
      const reviewLikes = likes.filter(like => like.review_id.toString() === review._id.toString());

      const likeCount = reviewLikes.filter(like => like.like).length;
      const dislikeCount = reviewLikes.filter(like => !like.like).length;
console.log(reviewLikes)
      return {
        ...review,
        likes: reviewLikes,
        likeCount,
        dislikeCount
      };
    });

    res.json({ recipe, reviews: reviewsWithLikes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const approvedRecipe = await Recipe.findByIdAndUpdate(
      id,
      { approved: true, status: "approved" },
      { new: true }
    );
    res.status(200).json(approvedRecipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const rejectRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const rejectedRecipe = await Recipe.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );
    res.status(200).json(rejectedRecipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const pendingRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const approvedRecipe = await Recipe.findByIdAndUpdate(
      id,
      { approved: false, status: "pending" },
      { new: true }
    );
    res.status(200).json(approvedRecipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getPendingRecipe = async (req, res) => {
  try {
    // Get query parameters and set default values
    const pageSize = parseInt(req.query.pageSize) || 10;
    const pageIndex = parseInt(req.query.pageIndex) || 1;
    const searchKeyword = req.query.search ? req.query.search.trim() : '';
    const statusQuery = req.query.status || 'all';

    // Initialize status filter
    let statusFilter = {};

    // Handle status filter
    if (statusQuery === 'pending') {
      statusFilter.status = 'pending';
    } else if (statusQuery === 'approved') {
      statusFilter.status = 'approved';
    } else if (statusQuery === 'rejected') {
      statusFilter.status = 'rejected';
    } else {
      statusFilter.status = { $in: ['pending', 'approved', 'rejected'] };
    }

    // Search filter: only apply if the search keyword is not empty
    let searchStage = {};
    if (searchKeyword) {
      searchStage = {
        $or: [
          { recipe_name_eng: { $regex: searchKeyword, $options: 'i' } },
          { 'category.name': { $regex: searchKeyword, $options: 'i' } },
        ],
      };
    }

    const totalRecipesPipeline = [
      { $match: statusFilter },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      searchStage ? { $match: searchStage } : null,
    ].filter(Boolean);

    const totalRecipesData = await Recipe.aggregate(totalRecipesPipeline);
    const totalRecipes = totalRecipesData.length;
    const totalPages = Math.ceil(totalRecipes / pageSize);

    const paginationPipeline = [
      { $match: statusFilter },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      searchStage ? { $match: searchStage } : null,
      { $sort: { createdAt: -1 } },
      { $skip: (pageIndex - 1) * pageSize },
      { $limit: pageSize },
    ].filter(Boolean);

    const pendingRecipes = await Recipe.aggregate(paginationPipeline);

    res.status(200).json({
      recipes: pendingRecipes,
      totalRecipes,
      totalPages,
      currentPage: pageIndex,
      pageSize,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
