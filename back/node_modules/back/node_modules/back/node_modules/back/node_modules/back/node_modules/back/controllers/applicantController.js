import ApplicantModel from "../models/Applicant.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const createApplicant = async (req, res) => {
  try {
    const newFile = new ApplicantModel({
      filename: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype,
      postedBy: req.user._id,
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

const updateApplicant = async (req, res) => {};

const deleteApplicant = async (req, res) => {};

export { createApplicant, fetchApplicants, updateApplicant, deleteApplicant };
