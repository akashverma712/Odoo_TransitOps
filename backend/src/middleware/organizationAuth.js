import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const organizationAuth = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please login.",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find organization
    const result = await pool.query(
      `SELECT
          id,
          organization_name,
          organization_type,
          number_of_workers,
          owner_name,
          is_registered
       FROM organizations
       WHERE id = $1`,
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Organization not found.",
      });
    }

    // Attach organization to request
    req.organization = result.rows[0];

    next();
  } catch (error) {
    console.error("Authentication Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export default organizationAuth;