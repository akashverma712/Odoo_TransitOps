import express from "express";
import {
  getNotifications,
  createNotification,
  markNotificationRead,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", getNotifications);

router.post("/", createNotification);

router.put("/:id/read", markNotificationRead);

router.delete("/:id", deleteNotification);

export default router;