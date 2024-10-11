import ReviewModel from "../models/Reviews.js";

const createReview = async (req, res) => {
  const { rating, review, revieweeId } = req.body;
  try {
    const newReview = new ReviewModel({
      rating,
      review,
      revieweeId,
      postedBy: req.user._id,
    });
    const result = await newReview.save();
    return res.status(201).json({ success: true, result });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ error: error.message });
  }
};
const fetchReviews = async (req, res) => {
  const { revieweeId } = req.query;
  const user = req.user._id;
  try {
    const reviews = await ReviewModel.find({
      $or: [{ revieweeId: revieweeId }],
    }).sort({ createdAt: 1 });
    return res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ error: error.message });
  }
};

const fetchReview = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(404).json({ error: "no ID specified" });
  }
  try {
    const review = await ReviewModel.find({ _id: id });
    return res.status(200).json({ success: true, review });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ error: error.message });
  }
};

const updateReview = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(404).json({ error: "no ID specified" });
  }
  try {
    const review = await ReviewModel.find({ _id: id });
    return res.status(200).json({ success: true, review });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ error: error.message });
  }
};
const deleteReview = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "No ID specified" });
  }
  try {
    await ReviewModel.findOneAndDelete({ _id: id });
    return res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ error: error.message });
  }
};

export { createReview, fetchReviews, fetchReview, updateReview, deleteReview };
