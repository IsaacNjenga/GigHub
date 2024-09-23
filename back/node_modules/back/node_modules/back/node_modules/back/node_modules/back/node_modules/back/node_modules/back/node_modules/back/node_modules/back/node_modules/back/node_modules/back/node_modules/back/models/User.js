import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  role: { type: String },
});

const UserModel = mongoose.model("user", UserSchema);
export default UserModel;
