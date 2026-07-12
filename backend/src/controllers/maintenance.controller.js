import pool from "../config/db.js";

export const getMaintenance = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        m.*,
        v.vehicle_number
      FROM maintenance m
      LEFT JOIN vehicles v
      ON m.vehicle_id = v.id
      ORDER BY m.created_at DESC
    `);

    res.json({
      success: true,
      maintenance: result.rows,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const getMaintenanceById = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM maintenance WHERE id=$1",
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.json({
      success: true,
      maintenance: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const createMaintenance = async (req, res) => {
  try {
    const {
      organization_id,
      vehicle_id,
      service_type,
      service_date,
      next_service,
      cost,
      status,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO maintenance
      (
      organization_id,
      vehicle_id,
      service_type,
      service_date,
      next_service,
      cost,
      status
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        organization_id,
        vehicle_id,
        service_type,
        service_date,
        next_service,
        cost,
        status,
      ]
    );

    res.status(201).json({
      success: true,
      maintenance: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const updateMaintenance = async (req, res) => {
  try {
    const {
      vehicle_id,
      service_type,
      service_date,
      next_service,
      cost,
      status,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE maintenance
      SET
      vehicle_id=$1,
      service_type=$2,
      service_date=$3,
      next_service=$4,
      cost=$5,
      status=$6
      WHERE id=$7
      RETURNING *
      `,
      [
        vehicle_id,
        service_type,
        service_date,
        next_service,
        cost,
        status,
        req.params.id,
      ]
    );

    res.json({
      success: true,
      maintenance: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const deleteMaintenance = async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM maintenance WHERE id=$1",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Maintenance deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};