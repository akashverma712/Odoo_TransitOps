import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const createOrganizationUser = async (req, res) => {
  try {
    const organization_id = req.organization.id;

    const {
      full_name,
      role,
      email,
      password,
    } = req.body;

    if (
      !full_name ||
      !role ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const allowedRoles = [
      "Fleet Manager",
      "Dispatcher",
      "Safety Officer",
      "Financial Analyst",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role.",
      });
    }

    const existingEmail = await pool.query(
      `SELECT id
       FROM organization_users
       WHERE email = $1`,
      [email]
    );

    if (existingEmail.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const existingRole = await pool.query(
      `SELECT id
       FROM organization_users
       WHERE organization_id = $1
       AND role = $2`,
      [organization_id, role]
    );

    if (existingRole.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: `${role} already exists for this organization.`,
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO organization_users
      (
        organization_id,
        full_name,
        role,
        email,
        password_hash
      )
      VALUES
      ($1,$2,$3,$4,$5)
      RETURNING
      id,
      full_name,
      role,
      email,
      created_at
      `,
      [
        organization_id,
        full_name,
        role,
        email,
        password_hash,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Employee created successfully.",
      user: result.rows[0],
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });

  }
};