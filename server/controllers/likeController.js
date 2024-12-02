import { Like } from "../models/likeModel.js";


export const likeReview = async (req, res) => {
  const { user_id, recipe_id, review_id, like } = req.body;

  try {
      const existingLike = await Like.findOne({ user_id, review_id });

      if (existingLike) {
          if (existingLike.like === like) {
              return res.status(400).json({ message: `You have already ${like ? 'liked' : 'disliked'} this review.` });
          }

          existingLike.like = like;
          await existingLike.save();
          return res.status(200).json({ message: "Like status updated." });
      }

      const newLike = new Like({ user_id, recipe_id, review_id, like });
      await newLike.save();

      res.status(201).json({ message: "Like added successfully." });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

  export const getLike = async (req, res) => {
    const { user_id, recipe_id, review_id } = req.query;
  
    try {
      if (user_id && review_id) {
        const like = await Like.findOne({ user_id, review_id });
        if (like) {
          return res.status(200).json({ like });
        }
        return res.status(404).json({ message: "Like not found." });
      }
  
      if (user_id && recipe_id) {
        const likes = await Like.find({ user_id, recipe_id });
        return res.status(200).json({ likes });
      }
      res.status(400).json({ message: "Invalid query parameters." });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };