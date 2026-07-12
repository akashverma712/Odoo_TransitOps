import pool from "../config/db.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

// ===========================================
// Register Organization
// ===========================================

export const registerOrganization = async (req, res) => {
  const {
    organization_name,
    organization_type,
    number_of_workers,
    owner_name,
    password,
    is_registered,
  } = req.body;

  if (
    !organization_name ||
    !organization_type ||
    !number_of_workers ||
    !owner_name ||
    !password ||
    is_registered === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    // Check if organization already exists
    const existing = await pool.query(
      "SELECT id FROM organizations WHERE organization_name = $1",
      [organization_name]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Organization already exists.",
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert organization
    const result = await pool.query(
      `
      INSERT INTO organizations
      (
        organization_name,
        organization_type,
        number_of_workers,
        owner_name,
        password_hash,
        is_registered
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING
        id,
        organization_name,
        organization_type,
        number_of_workers,
        owner_name,
        is_registered,
        created_at;
      `,
      [
        organization_name,
        organization_type,
        number_of_workers,
        owner_name,
        password_hash,
        is_registered,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Organization registered successfully.",
      organization: result.rows[0],
    });
  } catch (error) {
    console.error("Registration Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// ===========================================
// Login Organization
// ===========================================

export const loginOrganization = async (req, res) => {
  const { organization_name, password } = req.body;

  if (!organization_name || !password) {
    return res.status(400).json({
      success: false,
      message: "Organization name and password are required.",
    });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM organizations WHERE organization_name = $1",
      [organization_name]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid organization name or password.",
      });
    }

    const organization = result.rows[0];

    const isPasswordCorrect = await bcrypt.compare(
      password,
      organization.password_hash
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid organization name or password.",
      });
    }

    const token = generateToken(organization.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful.",
      organization: {
        id: organization.id,
        organization_name: organization.organization_name,
        organization_type: organization.organization_type,
        owner_name: organization.owner_name,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// ===========================================
// Get Logged In Organization
// ===========================================

export const getOrganizationProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      organization: req.organization,
    });
  } catch (error) {
    console.error("Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// ===========================================
// Logout Organization
// ===========================================

export const logoutOrganization = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};