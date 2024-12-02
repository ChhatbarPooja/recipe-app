import { Review } from "../models/reviewModel.js";

// Create review route
// Create a review
export const createReview = async (req, res) => {
  try {
    const { user_id, recipe_id, rating, review, recipe_title } = req.body;

    const existingReview = await Review.findOne({ user_id, recipe_id });

    // If there's an existing review, check if it's rejected
    if (existingReview) {
      if (existingReview.status === 'rejected') {
        await Review.deleteOne({ user_id, recipe_id });
      } else {
        return res.status(400).json({ error: 'You can only add one review per recipe.' });
      }
    }

    // Create and save the new review
    const newReview = new Review({
      user_id,
      recipe_id,
      rating,
      review,
      recipe_title,
      status: 'pending'
    });
    await newReview.save();

    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Approve review
export const approveReview = async (req, res) => {
  try {
    const { id } = req.params;
    const approvedReview = await Review.findByIdAndUpdate(id, { status: 'approved', approved:true, updated_at: Date.now() }, { new: true });
    res.status(200).json(approvedReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Reject review
export const rejectReview = async (req, res) => {
  try {
    const { id } = req.params;
    const rejectedReview = await Review.findByIdAndUpdate(id, { status: 'rejected', updated_at: Date.now() }, { new: true });
    res.status(200).json(rejectedReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all reviews for a recipe
export const getAllReview = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const reviews = await Review.find({ recipe_id: recipeId, status: 'approved' })
      .populate("user_id", "user_name")
      .exec();
    res.status(200).json(reviews);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { rating, review, updated_at: Date.now(), approved: false, status:'pending' },
      { new: true }
    );
    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get pending reviews with pagination
export const getPendingReviews = async (req, res) => {
  try {
    const status = req.query.status;
    const pageIndex = parseInt(req.query.pageIndex) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (pageIndex - 1) * pageSize;
    const searchTerm = req.query.review || '';

    let matchStage = {
      $and: []
    };

    // Add status filtering
    if (status === 'pending' || status === 'approved' || status === 'rejected') {
      matchStage.$and.push({ status });
    } else {
      matchStage.$and.push({ status: { $in: ['pending', 'approved', 'rejected'] } });
    }

    // If searchTerm exists, add filter for review, recipe_title, and user_name
    if (searchTerm) {
      matchStage.$and.push({
        $or: [
          { review: { $regex: searchTerm, $options: 'i' } },
          { recipe_title: { $regex: searchTerm, $options: 'i' } },
          { 'user_id.user_name': { $regex: searchTerm, $options: 'i' } }
        ]
      });
    }

    const reviews = await Review.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user_id'
        }
      },
      { $unwind: '$user_id' },
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: pageSize }
    ]);

    // Get total count of filtered reviews
    const totalReviews = await Review.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user_id'
        }
      },
      { $unwind: '$user_id' }, // Unwind the user details
      { $match: matchStage },
      { $count: 'totalReviews' }
    ]);

    res.status(200).json({
      reviews,
      totalPages: Math.ceil((totalReviews[0]?.totalReviews || 0) / pageSize),
      currentPage: pageIndex,
      totalReviews: totalReviews[0]?.totalReviews || 0,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const pendingReview = async (req, res) => {
  try {
    const { id } = req.params;
    const approvedReview = await Review.findByIdAndUpdate(id, { status: 'pending', approved:false, updated_at: Date.now() }, { new: true });
    res.status(200).json(approvedReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res.status(200).json({ message: "Review deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
