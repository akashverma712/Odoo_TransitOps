import express from "express";
import {
  getFuelLogs,
  getFuelLogById,
  createFuelLog,
  updateFuelLog,
  deleteFuelLog,
} from "../controllers/fuel.controller.js";

const router = express.Router();

router.get("/", getFuelLogs);

router.get("/:id", getFuelLogById);

router.post("/", createFuelLog);

router.put("/:id", updateFuelLog);

router.delete("/:id", deleteFuelLog);

export default router;