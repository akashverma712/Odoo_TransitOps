import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";

import organizationRoutes from "./src/routes/organization.routes.js";
import organizationUserRoutes from "./src/routes/organizationUser.routes.js";

dotenv.config();

const app = express();


app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/organization", organizationRoutes);
app.use("/api/organization/users", organizationUserRoutes);


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Organization Registration API is running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});