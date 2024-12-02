import mongoose from "mongoose";

const Schema = mongoose.Schema;

const FavoriteSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  recipe_id : { type: Schema.Types.ObjectId, ref: "Recipe" },
},{ timestamps: true });
export const Favorite = mongoose.model('Favorite', FavoriteSchema);
