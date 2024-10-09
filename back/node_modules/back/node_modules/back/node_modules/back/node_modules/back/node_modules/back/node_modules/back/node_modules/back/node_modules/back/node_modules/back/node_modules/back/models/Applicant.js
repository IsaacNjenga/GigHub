import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema(
  {
    filename: { type: String },
    data: Buffer,
    contentType: { type: String },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    jobId: { type: String },
    username: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    expertise: { type: String },
    email: { type: String },
    phone: { type: String },
    profileImage: { type: String },
  },
  { collection: "applicant", timestamps: true }
);

const ApplicantModel = mongoose.model("applicant", applicantSchema);
export default ApplicantModel;
