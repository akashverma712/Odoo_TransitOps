import express from "express";
import { createOrganizationUser } from "../controllers/organizationUser.controller.js";
import organizationAuth from "../middleware/organizationAuth.js";

const router = express.Router();

// Protected Route
router.post("/", organizationAuth, createOrganizationUser);

export default router;