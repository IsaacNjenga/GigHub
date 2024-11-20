import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    username: { type: String },
    email: { type: String },
    mobile: { type: String },
    subject: { type: String },
    complaint: { type: String },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { collection: "reports", timestamps: true }
);

const ReportsModel = mongoose.model("reports", reportSchema);
export default ReportsModel;
