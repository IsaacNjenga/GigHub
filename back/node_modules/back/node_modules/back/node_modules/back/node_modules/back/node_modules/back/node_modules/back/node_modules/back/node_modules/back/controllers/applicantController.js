import ApplicantModel from "../models/Applicant.js";
import multer from "multer";

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
      contractorId,
      username,
      role,
    } = req.body;

    const file = req.file.filename;
    const fileName = req.file.filename;
    const filePath = `/files/${req.file.filename}`;
    const newFile = new ApplicantModel({
      filename: fileName,
      file: file,
      filePath: filePath,
      postedBy: req.user._id,
      firstname,
      lastname,
      expertise,
      jobId,
      email,
      username,
      phone,
      profileImage,
      contractorId,
      role,
      contentType: req.file.mimetype,
      data: req.file.buffer,
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

const fetchFile = async (req, res) => {
  try {
    console.log("Fetching file with ID:", req.params.fileId);
    const file = await ApplicantModel.findById(req.params.fileId);
    if (!file) {
      return res.status(404).send("File not found");
    }
    res.setHeader("Content-Type", file.contentType);
    res.send(file.data); //binary data sent here
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
  fetchFile,
};
