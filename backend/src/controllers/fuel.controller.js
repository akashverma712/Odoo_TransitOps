import pool from "../config/db.js";

export const getFuelLogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        f.*,
        v.vehicle_number
      FROM fuel_logs f
      LEFT JOIN vehicles v
      ON f.vehicle_id = v.id
      ORDER BY f.created_at DESC
    `);

    res.json({
      success: true,
      fuelLogs: result.rows,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const getFuelLogById = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM fuel_logs WHERE id=$1",
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Fuel log not found",
      });
    }

    res.json({
      success: true,
      fuelLog: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const createFuelLog = async (req, res) => {
  try {
    const {
      organization_id,
      vehicle_id,
      liters,
      amount,
      filled_on,
      fuel_station,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO fuel_logs
      (
      organization_id,
      vehicle_id,
      liters,
      amount,
      filled_on,
      fuel_station
      )
      VALUES
      ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        organization_id,
        vehicle_id,
        liters,
        amount,
        filled_on,
        fuel_station,
      ]
    );

    res.status(201).json({
      success: true,
      fuelLog: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

export const updateFuelLog = async (req, res) => {
  try {
    const {
      vehicle_id,
      liters,
      amount,
      filled_on,
      fuel_station,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE fuel_logs
      SET
      vehicle_id=$1,
      liters=$2,
      amount=$3,
      filled_on=$4,
      fuel_station=$5
      WHERE id=$6
      RETURNING *
      `,
      [
        vehicle_id,
        liters,
        amount,
        filled_on,
        fuel_station,
        req.params.id,
      ]
    );

    res.json({
      success: true,
      fuelLog: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const deleteFuelLog = async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM fuel_logs WHERE id=$1",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Fuel log deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};