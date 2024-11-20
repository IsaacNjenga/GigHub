import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema(
  {
    // filename: { type: String },
    // file: { type: String },
    // data: Buffer,
    // contentType: String,
    //filePath: { type: String },
    files: [
      {
        fieldName: { type: String },
        filename: { type: String },
        contentType: { type: String },
        data: { type: Buffer },
      },
    ],
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    jobId: { type: String },
    username: { type: String },
    firstname: { type: String },
    username: { type: String },
    lastname: { type: String },
    expertise: { type: String },
    email: { type: String },
    phone: { type: String },
    role: { type: String },
    profileImage: { type: String },
    contractorId: { type: String },
  },
  { collection: "applicant", timestamps: true }
);

const ApplicantModel = mongoose.model("applicant", applicantSchema);
export default ApplicantModel;
