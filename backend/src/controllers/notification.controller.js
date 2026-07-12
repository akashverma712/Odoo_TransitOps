import pool from "../config/db.js";

export const getNotifications = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notifications ORDER BY created_at DESC"
    );

    res.json({
      success: true,
      notifications: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

export const createNotification = async (req, res) => {
  try {
    const {
      organization_id,
      title,
      message,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO notifications
      (
        organization_id,
        title,
        message
      )
      VALUES
      ($1,$2,$3)
      RETURNING *
      `,
      [
        organization_id,
        title,
        message,
      ]
    );

    res.status(201).json({
      success: true,
      notification: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const result = await pool.query(
      `
      UPDATE notifications
      SET is_read=true
      WHERE id=$1
      RETURNING *
      `,
      [req.params.id]
    );

    res.json({
      success: true,
      notification: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM notifications WHERE id=$1",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};