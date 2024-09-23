import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema(
  {
    filename: { type: String },
    data: Buffer,
    contentType: { type: String },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { collection: "applicant", timestamps: true }
);

const ApplicantModel = mongoose.model("applicant", applicantSchema);
export default ApplicantModel;
