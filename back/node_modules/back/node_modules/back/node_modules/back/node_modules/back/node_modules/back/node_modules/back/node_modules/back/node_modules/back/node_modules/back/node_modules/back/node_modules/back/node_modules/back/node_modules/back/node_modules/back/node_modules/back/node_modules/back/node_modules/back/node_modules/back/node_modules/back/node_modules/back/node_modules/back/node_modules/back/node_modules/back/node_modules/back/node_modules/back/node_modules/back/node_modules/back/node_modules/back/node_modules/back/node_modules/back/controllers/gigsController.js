import mongoose from "mongoose";
import GigsModel from "../models/Gigs.js";

const createGig = async (req, res) => {
  try {
    const {
      title,
      summary,
      type,
      responsibilities,
      requirements,
      environment,
      benefits,
      location,
      organisation,
      apply,
      info,
      username,
    } = req.body;

    const newGig = new GigsModel({
      title,
      summary,
      type,
      responsibilities,
      requirements,
      environment,
      benefits,
      location,
      organisation,
      apply,
      info,
      username,
      postedBy: req.user._id,
    });

    const result = await newGig.save();
    return res.status(201).json({ success: true, result });
  } catch (error) {
    console.log("Error posting Gig");
    return res.status(500).json({ error: error.message });
  }
};

const updateGig = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "No ID specified" });
  }
  try {
    const result = await GigsModel.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );
    res.status(200).json({ success: true, ...result._doc });
  } catch (error) {
    console.log("Error updating Gig");
    return res.status(500).json({ error: error.message });
  }
};

const deleteGig = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: error.message });
  }
  try {
    const gig = await GigsModel.findById(id);
    if (!gig) {
      return res.status(404).json({ error: "Gig not found" });
    }
    const deleteGig = await GigsModel.findByIdAndDelete({ _id: id });
    const gigs = await GigsModel.find({});
    return res.status(200).json({ success: true, gigs });
  } catch (error) {
    console.log("Error deleting Gig");
    return res.status(500).json({ error: error.message });
  }
};

const fetchGigs = async (req, res) => {
  try {
    const gigs = await GigsModel.find({});
    return res.status(200).json({ success: true, gigs });
  } catch (error) {
    console.error("Error fetching Gig", error);
    return res.status(500).json({ error: error.message });
  }
};

const fetchGig = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "No ID specified" });
  }
  try {
    const gig = await GigsModel.findById(id);
    if (!gig) {
      return res.status(404).json({ error: "Gig not found" });
    }
    return res.status(200).json({ success: true, gig });
  } catch (error) {
    console.error("Error fetching Gig", error);
    return res.status(500).json({ error: error.message });
  }
};

const fetchUserGigs = async (req, res) => {
  const { jobId } = req.query;
  if (!jobId) {
    return res.status(400).json({ error: "No ID specified" });
  }
  try {
    const gig = await GigsModel.find({ _id: jobId });
    if (!gig) {
      return res.status(404).json({ error: "Gig not found" });
    }
    return res.status(200).json({ success: true, gig });
  } catch (error) {
    console.error("Error fetching Gig", error);
    return res.status(500).json({ error: error.message });
  }
};

export { createGig, updateGig, deleteGig, fetchGigs, fetchGig, fetchUserGigs };
