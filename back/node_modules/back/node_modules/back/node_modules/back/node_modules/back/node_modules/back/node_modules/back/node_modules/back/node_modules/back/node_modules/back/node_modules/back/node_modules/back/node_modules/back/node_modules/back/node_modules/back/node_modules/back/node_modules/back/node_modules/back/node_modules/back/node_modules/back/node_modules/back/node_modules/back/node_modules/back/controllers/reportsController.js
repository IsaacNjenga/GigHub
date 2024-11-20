import ReportsModel from "../models/Reports.js";

const createReport = async (req, res) => {
  try {
    const { username, email, mobile, subject, complaint } = req.body;

    const newReport = new ReportsModel({
      username,
      email,
      mobile,
      subject,
      complaint,
      postedBy: req.user._id,
    });

    const result = await newReport.save();
    return res.status(201).json({ success: true, result });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const fetchReports = async (req, res) => {
  try {
    const reports = await ReportsModel.find({});
    return res.status(200).json({ success: true, reports });
  } catch (error) {
    console.error("Error fetching reports", error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteReport = async (req, res) => {};

const fetchReport = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(404).json({ error: "no ID specified" });
  }
  try {
    const report = await ReportsModel.find({ _id: id });
    return res.status(200).json({ success: true, report });
  } catch (error) {
    console.error("Error fetching reports", error);
    return res.status(500).json({ error: error.message });
  }
};

const updateReport = async (req, res) => {};

export { createReport, fetchReports, deleteReport, fetchReport, updateReport };
