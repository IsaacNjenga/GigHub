import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    rating: { type: String },
    review: { type: String },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { collection: "reviews", timestamps: true }
);

const ReviewModel = mongoose.model("reviews", reviewSchema);
export default ReviewModel;
