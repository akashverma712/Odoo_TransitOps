import pool from "../config/db.js";

export const getDrivers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM drivers ORDER BY created_at DESC"
    );

    res.json({
      success: true,
      drivers: result.rows,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const getDriverById = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM drivers WHERE id=$1",
      [req.params.id]
    );

    if (!result.rows.length)
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });

    res.json({
      success: true,
      driver: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const createDriver = async (req, res) => {
  try {
    const {
      organization_id,
      full_name,
      phone,
      license_number,
      license_expiry,
      experience_years,
      status,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO drivers
      (
      organization_id,
      full_name,
      phone,
      license_number,
      license_expiry,
      experience_years,
      status
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        organization_id,
        full_name,
        phone,
        license_number,
        license_expiry,
        experience_years,
        status,
      ]
    );

    res.status(201).json({
      success: true,
      driver: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const {
      full_name,
      phone,
      license_number,
      license_expiry,
      experience_years,
      status,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE drivers
      SET
      full_name=$1,
      phone=$2,
      license_number=$3,
      license_expiry=$4,
      experience_years=$5,
      status=$6
      WHERE id=$7
      RETURNING *
      `,
      [
        full_name,
        phone,
        license_number,
        license_expiry,
        experience_years,
        status,
        req.params.id,
      ]
    );

    res.json({
      success: true,
      driver: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM drivers WHERE id=$1",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Driver deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};