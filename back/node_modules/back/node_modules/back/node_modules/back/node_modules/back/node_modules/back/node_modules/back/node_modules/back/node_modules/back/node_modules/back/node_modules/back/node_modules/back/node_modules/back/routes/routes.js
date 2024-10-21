import express from "express";

import {
  Login,
  Register,
  Auth,
  fetchUserName,
} from "../controllers/userController.js";

import {
  profile,
  createProfile,
  updateProfile,
  deleteProfile,
  fetchProfile,
  fetchReviewProfile,
  fetchCurrentUser,
} from "../controllers/profileController.js";

import {
  createGig,
  fetchGigs,
  fetchGig,
  updateGig,
  deleteGig,
  fetchUserGigs,
  fetchedContractorGigs,
} from "../controllers/gigsController.js";

import {
  createApplicant,
  deleteApplicant,
  fetchApplicants,
  fetchUserApplications,
} from "../controllers/applicantController.js";

import {
  createChat,
  deleteChat,
  fetchChats,
  fetchLastChatForUser,
  updateChat,
} from "../controllers/chatController.js";

import {
  createReview,
  deleteReview,
  fetchReview,
  fetchReviews,
  updateReview,
} from "../controllers/reviewController.js";

import { VerifyUser } from "../middleware/verifyUser.js";
import multer from "multer";
const router = express.Router();
import { body } from "express-validator";

router.post(
  "/register",
  [
    (body("name")
      .trim()
      .notEmpty()
      .withMessage("This field should not be empty"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("This field should not be empty")
      .isEmail()
      .withMessage("Invalid e-mail address"),
    body("role")
      .trim()
      .notEmpty()
      .withMessage("This field should not be empty"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("This field should not be empty")
      .isLength({ min: 8, max: 30 })
      .withMessage("Password length should be 8-30 characters")),
  ],
  Register
);

router.post(
  "/login",
  [
    (body("email")
      .trim()
      .notEmpty()
      .withMessage("This field should not be empty")
      .isEmail()
      .withMessage("Invalid e-mail address"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("This field should not be empty")
      .isLength({ min: 8, max: 30 })
      .withMessage("Password length should be 8-30 characters")),
  ],
  Login
);

router.get("/verify", VerifyUser, Auth);
router.get("/user", VerifyUser, fetchUserName);

//profile routes
router.post("/createProfile", VerifyUser, createProfile);
router.get("/profile", VerifyUser, profile);
router.get("/fetchProfile", VerifyUser, fetchProfile);
router.get("/fetchCurrentUser", VerifyUser, fetchCurrentUser);
router.get("/reviewerProfile", VerifyUser, fetchReviewProfile);
router.put("/updateProfile/:id", VerifyUser, updateProfile);
router.delete("/deleteProfile/:id", VerifyUser, deleteProfile);

//gig routes
router.get("/fetchGigs", VerifyUser, fetchGigs);
router.get("/fetchContractorGigs", VerifyUser, fetchedContractorGigs);
router.get("/fetchGig/:id", VerifyUser, fetchGig);
router.get("/fetchUserGigs", VerifyUser, fetchUserGigs);
router.post("/createGig", VerifyUser, createGig);
router.put("/updateGig/:id", VerifyUser, updateGig);
router.delete("/deleteGig/:id", VerifyUser, deleteGig);

//applicant routes
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/apply", upload.single("resume"), VerifyUser, createApplicant);
router.get("/applicants", VerifyUser, fetchApplicants);
router.get("/fetchUserApplicants", VerifyUser, fetchUserApplications);
router.delete("/deleteApplication/:id", VerifyUser, deleteApplicant);

//chat routes
router.post("/createChat", VerifyUser, createChat);
router.get("/fetchChats", VerifyUser, fetchChats);
router.put("/updateChat/:id", VerifyUser, updateChat);
router.delete("/deleteChat/:id", VerifyUser, deleteChat);
router.get("/fetchLastChatForUser", VerifyUser, fetchLastChatForUser);

//review routes
router.post("/createReview", VerifyUser, createReview);
router.get("/fetchReviews", VerifyUser, fetchReviews);
router.get("/fetchReview/:id", VerifyUser, fetchReview);
router.put("/updateReview/:id", VerifyUser, updateReview);
router.delete("/deleteReview", VerifyUser, deleteReview); //deleting with a query

export { router as Router };
