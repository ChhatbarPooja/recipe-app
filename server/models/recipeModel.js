import mongoose from "mongoose";
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  recipe_name_eng: { type: String },
  recipe_name_hindi: { type: String },
  recipe_name_guj: { type: String },
  ingredients_eng: { type: String },
  ingredients_hindi: { type: String },
  ingredients_guj: { type: String },
  recipe_steps_eng: { type: String },
  recipe_steps_hindi: { type: String },
  recipe_steps_guj: { type: String },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  num_of_people_to_served: { type: Number, required: true },
  cooking_time: { type: String },
  preparation_time: { type: String },
  difficulty_level: { type: String },
  images: { type: String, required: true },
  video_url: { type: String },
  approved: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },  
  create_by: { type: Schema.Types.ObjectId, ref: "User" },
  update_by: { type: Schema.Types.ObjectId, ref: "User" },
  delete_at: { type: Date },
  delete_by: { type: Schema.Types.ObjectId, ref: "User" },
}, {
  timestamps: true
});

RecipeSchema.pre('validate', function(next) {
  if (this.recipe_name_eng || this.recipe_name_hindi || this.recipe_name_guj) {
    next();
  } else {
    next(new Error('At least one of the recipe names (English, Hindi, Gujarati) must be provided.'));
  }
});

// Custom validation for at least one ingredient
RecipeSchema.pre('validate', function(next) {
  if (this.ingredients_eng || this.ingredients_hindi || this.ingredients_guj) {
    next();
  } else {
    next(new Error('At least one of the ingredients (English, Hindi, Gujarati) must be provided.'));
  }
});

// Custom validation for at least one recipe step
RecipeSchema.pre('validate', function(next) {
  if (this.recipe_steps_eng || this.recipe_steps_hindi || this.recipe_steps_guj) {
    next();
  } else {
    next(new Error('At least one of the recipe steps (English, Hindi, Gujarati) must be provided.'));
  }
});

export const Recipe = mongoose.model("Recipe", RecipeSchema);