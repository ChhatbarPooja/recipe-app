import mongoose from "mongoose";
const Schema = mongoose.Schema;

const likeSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  review_id: { type: Schema.Types.ObjectId, ref: "Review", required: true },
  recipe_id: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
  like: { type: Boolean, required: true },
}, {
  timestamps: true
});

export const Like = mongoose.model("Like", likeSchema);