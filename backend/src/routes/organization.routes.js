import express from "express";

import {
  registerOrganization,
  loginOrganization,
  getOrganizationProfile,
  logoutOrganization,
} from "../controllers/organization.controller.js";

import organizationAuth from "../middleware/organizationAuth.js";

const router = express.Router();

// Public Routes
router.post("/register", registerOrganization);
router.post("/login", loginOrganization);

// Protected Routes
router.get("/me", organizationAuth, getOrganizationProfile);
router.post("/logout", organizationAuth, logoutOrganization);

export default router;