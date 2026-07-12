import pool from "../config/db.js";

export const getDashboard = async (req, res) => {
  try {
    const [
      vehicles,
      drivers,
      trips,
      maintenance,
      fuel,
      notifications,
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM vehicles"),
      pool.query("SELECT COUNT(*) FROM drivers"),
      pool.query(
        "SELECT COUNT(*) FROM trips WHERE status='Ongoing'"
      ),
      pool.query(
        "SELECT COUNT(*) FROM maintenance WHERE status='Pending'"
      ),
      pool.query(
        "SELECT COALESCE(SUM(amount),0) AS total FROM fuel_logs"
      ),
      pool.query(
        "SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5"
      ),
    ]);

    res.json({
      success: true,
      dashboard: {
        totalVehicles: Number(vehicles.rows[0].count),
        totalDrivers: Number(drivers.rows[0].count),
        ongoingTrips: Number(trips.rows[0].count),
        pendingMaintenance: Number(maintenance.rows[0].count),
        totalFuelExpense: fuel.rows[0].total,
        recentNotifications: notifications.rows,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Dashboard error",
    });
  }
};