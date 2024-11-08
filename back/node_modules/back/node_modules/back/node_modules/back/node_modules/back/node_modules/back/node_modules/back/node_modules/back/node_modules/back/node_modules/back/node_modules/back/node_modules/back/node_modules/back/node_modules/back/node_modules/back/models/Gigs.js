import mongoose from "mongoose";

const GigSchema = new mongoose.Schema(
  {
    title: { type: String },
    summary: { type: String },
    type: { type: String },
    responsibilities: { type: String },
    requirements: { type: String },
    environment: { type: String },
    benefits: { type: String },
    location: { type: String },
    organisation: { type: String },
    apply: { type: String },
    info: { type: String },
    username: { type: String },
    lat: { type: String },
    lng: { type: String },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { collection: "gigs", timestamps: true }
);

const GigsModel = mongoose.model("gigs", GigSchema);
export default GigsModel;
