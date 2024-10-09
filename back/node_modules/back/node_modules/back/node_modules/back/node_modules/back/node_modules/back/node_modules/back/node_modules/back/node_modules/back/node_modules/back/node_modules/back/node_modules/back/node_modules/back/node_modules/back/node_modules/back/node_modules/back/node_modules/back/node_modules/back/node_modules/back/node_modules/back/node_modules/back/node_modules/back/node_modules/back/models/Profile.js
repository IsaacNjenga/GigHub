import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    profileImage: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    gender: { type: String },
    email: { type: String },
    phone: { type: String },
    dob: { type: String },
    expertise: { type: String },
    bio: { type: String },
    goals: { type: String },
    interests: { type: String },
    username: { type: String },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { collection: "profile", timestamps: true }
);

const ProfileModel = mongoose.model("profile", ProfileSchema);
export default ProfileModel;
