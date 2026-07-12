import pool from "../config/db.js";

export const getVehicles = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM vehicles ORDER BY created_at DESC"
    );

    res.json({
      success: true,
      vehicles: result.rows,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM vehicles WHERE id=$1",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });

    res.json({
      success: true,
      vehicle: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const createVehicle = async (req, res) => {
  try {
    const {
      organization_id,
      vehicle_number,
      vehicle_type,
      model,
      manufacturer,
      manufacturing_year,
      fuel_type,
      capacity,
      registration_number,
      insurance_expiry,
      pollution_expiry,
      status,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO vehicles
      (
      organization_id,
      vehicle_number,
      vehicle_type,
      model,
      manufacturer,
      manufacturing_year,
      fuel_type,
      capacity,
      registration_number,
      insurance_expiry,
      pollution_expiry,
      status
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *
      `,
      [
        organization_id,
        vehicle_number,
        vehicle_type,
        model,
        manufacturer,
        manufacturing_year,
        fuel_type,
        capacity,
        registration_number,
        insurance_expiry,
        pollution_expiry,
        status,
      ]
    );

    res.status(201).json({
      success: true,
      vehicle: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      vehicle_number,
      vehicle_type,
      model,
      manufacturer,
      manufacturing_year,
      fuel_type,
      capacity,
      registration_number,
      insurance_expiry,
      pollution_expiry,
      status,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE vehicles
      SET
      vehicle_number=$1,
      vehicle_type=$2,
      model=$3,
      manufacturer=$4,
      manufacturing_year=$5,
      fuel_type=$6,
      capacity=$7,
      registration_number=$8,
      insurance_expiry=$9,
      pollution_expiry=$10,
      status=$11
      WHERE id=$12
      RETURNING *
      `,
      [
        vehicle_number,
        vehicle_type,
        model,
        manufacturer,
        manufacturing_year,
        fuel_type,
        capacity,
        registration_number,
        insurance_expiry,
        pollution_expiry,
        status,
        id,
      ]
    );

    res.json({
      success: true,
      vehicle: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM vehicles WHERE id=$1",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Vehicle deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};