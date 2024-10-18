import ProfileModel from "../models/Profile.js";

const createProfile = async (req, res) => {
  try {
    const {
      profileImage,
      firstname,
      lastname,
      gender,
      email,
      phone,
      dob,
      expertise,
      bio,
      goals,
      interests,
      username,
      role,
    } = req.body;

    const newProfile = new ProfileModel({
      profileImage,
      firstname,
      lastname,
      gender,
      email,
      phone,
      dob,
      expertise,
      bio,
      goals,
      interests,
      username,
      role,
      postedBy: req.user._id,
    });

    const result = await newProfile.save();
    return res.status(201).json({ success: true, result });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const profile = async (req, res) => {
  try {
    const profile = await ProfileModel.find({ postedBy: req.user._id });
    return res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Error fetching user profile", error);
    return res.status(500).json({ error: error.message });
  }
};

const fetchReviewProfile = async (req, res) => {
  const { reviewerId } = req.query;
  try {
    const profileData = await ProfileModel.find({ postedBy: reviewerId });
    return res.status(200).json({ success: true, profileData });
  } catch (error) {
    console.error("Error fetching user profile", error);
    return res.status(500).json({ error: error.message });
  }
};

const fetchProfile = async (req, res) => {
  try {
    const profile = await ProfileModel.find({});
    return res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Error fetching user profile", error);
    return res.status(500).json({ error: error.message });
  }
};

const fetchCurrentUser = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(404).json({ error: "no ID specified" });
  }
  try {
    const profile = await ProfileModel.find({ postedBy: userId });
    return res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Error fetching user profile", error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteProfile = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "No ID specified" });
  }
  try {
    const profile = await ProfileModel.findOne({ postedBy: id });
    if (!profile) {
      return res.status(404).json({ error: "No profile found" });
    }
    await ProfileModel.findOneAndDelete({
      postedBy: id,
    });
    return res
      .status(200)
      .json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting user profile", error);
    return res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(401).json({ error: "No ID specified" });
  }
  try {
    const result = await ProfileModel.findOneAndUpdate(
      { postedBy: id },
      { ...req.body },
      { new: true }
    );
    return res.status(200).json({ success: true, ...result._doc });
  } catch (error) {
    console.log("Error updating profile", error);
    return res.status(500).json({ error: error.message });
  }
};

export {
  createProfile,
  profile,
  deleteProfile,
  updateProfile,
  fetchProfile,
  fetchReviewProfile,
  fetchCurrentUser,
};
