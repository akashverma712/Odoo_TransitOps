import pool from "../config/db.js";

export const getTrips = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        t.*,
        v.vehicle_number,
        d.full_name AS driver_name
      FROM trips t
      LEFT JOIN vehicles v ON t.vehicle_id = v.id
      LEFT JOIN drivers d ON t.driver_id = d.id
      ORDER BY t.created_at DESC
    `);

    res.json({
      success: true,
      trips: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

export const getTripById = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM trips WHERE id=$1",
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    res.json({
      success: true,
      trip: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const createTrip = async (req, res) => {
  try {
    const {
      organization_id,
      vehicle_id,
      driver_id,
      source,
      destination,
      start_time,
      end_time,
      status,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO trips
      (
        organization_id,
        vehicle_id,
        driver_id,
        source,
        destination,
        start_time,
        end_time,
        status
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        organization_id,
        vehicle_id,
        driver_id,
        source,
        destination,
        start_time,
        end_time,
        status,
      ]
    );

    res.status(201).json({
      success: true,
      trip: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const {
      vehicle_id,
      driver_id,
      source,
      destination,
      start_time,
      end_time,
      status,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE trips
      SET
      vehicle_id=$1,
      driver_id=$2,
      source=$3,
      destination=$4,
      start_time=$5,
      end_time=$6,
      status=$7
      WHERE id=$8
      RETURNING *
      `,
      [
        vehicle_id,
        driver_id,
        source,
        destination,
        start_time,
        end_time,
        status,
        req.params.id,
      ]
    );

    res.json({
      success: true,
      trip: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM trips WHERE id=$1",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Trip deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};