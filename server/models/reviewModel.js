import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  recipe_id: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
  rating: { type: Number, min: 1, max: 5 },
  review: { type: String },
  recipe_title: { type: String },
  review_by: { type: String, ref: 'User' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approved: { type: Boolean, default: false },
}, {
  timestamps: true
});

ReviewSchema.path('review').validate(function() {
  return this.review || this.rating;
}, 'Either review or rating must be provided.');

ReviewSchema.path('rating').validate(function() {
  return this.review || this.rating;
}, 'Either review or rating must be provided.');

export const Review = mongoose.model('Review', ReviewSchema);