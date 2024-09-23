import ReviewModel from "../models/Reviews.js";

const createReview = async (req, res) => {
  const { rating, review } = req.body;
  try {
    const newReview = new ReviewModel({
      rating,
      review,
      postedBy: req.user._id,
    });
    const result = await newReview.save();
    return res.status(201).json({ success: true, result });
  } catch (error) {
    console.log("Error", error);
    return res.statsu(500).json({ error: error.message });
  }
};
const fetchReviews = async (req, res) => {
  try {
    const reviews = await ReviewModel.find({});
    return res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.log("Error", error);
    return res.statsu(500).json({ error: error.message });
  }
};
const updateReview = async (req, res) => {
  try {
  } catch (error) {
    console.log("Error", error);
    return res.statsu(500).json({ error: error.message });
  }
};
const deleteReview = async (req, res) => {
  try {
  } catch (error) {
    console.log("Error", error);
    return res.statsu(500).json({ error: error.message });
  }
};

export { createReview, fetchReviews, updateReview, deleteReview };
