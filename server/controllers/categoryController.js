import { Category } from "../models/categoryModel.js";
import { getCategoryWithSubcategories, getCategoryWithSubcategories1 } from "../utils/common.js";

// Create a new category
export const createCategory = async (req, res) => {
  // console.log("req.body ==>" , req.body)
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.log("error in category ===>", err);
    res.status(400).json({ message: err.message });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    // Fetch all top-level categories (those with subcategory: null)
    const topLevelCategories = await Category.find({ subcategory: null, delete_at: null });
    // console.log("top leve category ==>", topLevelCategories);
    // Build the hierarchy for each top-level category
    const categoriesWithHierarchy = await Promise.all(
      topLevelCategories.map((category) =>
      getCategoryWithSubcategories(category._id)
      )
    );

    res.json(categoriesWithHierarchy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a category by ID
export const getCategoryById = async (req, res) => {
  // console.log("get by id call ==>" , req.params.id)
  try {
    const category = await Category.findById(req.params.id).populate(
      "subcategory"
    );
    // console.log("category ==>" , category)

    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a category by ID
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//soft delete by id
export const softDeleteCategory = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  // console.log("id" , id, userId)

  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { delete_at: new Date(), delete_by: userId, update_at: new Date() },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error soft deleting category", error });
  }
};

// Delete a category by ID
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
