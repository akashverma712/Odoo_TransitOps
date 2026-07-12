import express from "express";
import {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
} from "../controllers/trip.controller.js";

const router = express.Router();

router.get("/", getTrips);

router.get("/:id", getTripById);

router.post("/", createTrip);

router.put("/:id", updateTrip);

router.delete("/:id", deleteTrip);

export default router;