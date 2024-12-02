import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  status: { type: Boolean, default: true },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  create_by: { type: Schema.Types.ObjectId, ref: 'User' },
  update_by: { type: Schema.Types.ObjectId, ref: 'User' },
  delete_at: { type: Date },
  delete_by: { type: Schema.Types.ObjectId, ref: 'User' },
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  }
});

export const Category = mongoose.model('Category', CategorySchema);

