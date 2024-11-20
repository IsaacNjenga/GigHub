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

    //console.log("Files received:", req.files);

    //const file = req.file.originalname;
    const uploadedFiles = Object.entries(req.files || {}).map(
      ([key, fileArray]) => {
        const file = fileArray[0]; // Take the first file if multiple files are not allowed
        return {
          fieldName: key,
          filename: file.originalname,
          contentType: file.mimetype,
          data: file.buffer,
        };
      }
    );

    const newFile = new ApplicantModel({
      files: uploadedFiles,
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

// const fetchFile = async (req, res) => {
//   try {
//     console.log("Fetching file with ID:", req.params.fileId);
//     const file = await ApplicantModel.findById(req.params.fileId);
//     if (!file) {
//       return res.status(404).send("File not found");
//     }
//     res.setHeader("Content-Type", file.contentType);
//     res.send(file.data); //binary data sent here
//   } catch (error) {
//     console.error("Error", error);
//     return res.status(500).json({ error: error.message });
//   }
// };

const fetchFile = async (req, res) => {
  const fileId = req.params.fileId;
  try {
    const applicant = await ApplicantModel.findOne({
      "files._id": req.params.fileId,
    });

    if (!applicant) {
      return res.status(404).send("File not found");
    }
    const file = applicant.files.id(req.params.fileId);
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
