import ApplicantModel from "../models/Applicant.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const createApplicant = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      expertise,
      email,
      phone,
      profileImage,
      jobId,
    } = req.body;

    const newFile = new ApplicantModel({
      filename: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype,
      postedBy: req.user._id,
      //username,
      firstname,
      lastname,
      expertise,
      jobId,
      email,
      phone,
      profileImage,
    });
    const result = await newFile.save();
    return res.status(201).json({ success: true, result });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ error: error.message });
  }
};

const fetchApplicants = async (req, res) => {
  try {
    const applicants = await ApplicantModel.find({});
    return res.status(200).json({ success: true, applicants });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ error: error.message });
  }
};

const fetchUserApplications = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: "No user ID specified" });
  }
  try {
    const applicants = await ApplicantModel.find({ postedBy: userId });
    return res.status(200).json({ success: true, applicants });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ error: error.message });
  }
};

const updateApplicant = async (req, res) => {};

const deleteApplicant = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "No ID specified" });
  }
  try {
    // Find by jobId, not by MongoDB _id
    const jobApplication = await ApplicantModel.findOne({ jobId: id });
    if (!jobApplication) {
      return res.status(404).json({ error: "No application found" });
    }
    await ApplicantModel.findOneAndDelete({ jobId: id });

    const applicants = await ApplicantModel.find({});
    return res.status(200).json({ success: true, applicants });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ error: error.message });
  }
};

export {
  createApplicant,
  fetchApplicants,
  updateApplicant,
  deleteApplicant,
  fetchUserApplications,
};
