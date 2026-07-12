import pool from "../config/db.js";

export const getDocuments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        d.*,
        v.vehicle_number
      FROM documents d
      LEFT JOIN vehicles v
      ON d.vehicle_id = v.id
      ORDER BY d.created_at DESC
    `);

    res.json({
      success: true,
      documents: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM documents WHERE id=$1",
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.json({
      success: true,
      document: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const createDocument = async (req, res) => {
  try {
    const {
      organization_id,
      vehicle_id,
      document_name,
      expiry_date,
      status,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO documents
      (
        organization_id,
        vehicle_id,
        document_name,
        expiry_date,
        status
      )
      VALUES
      ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [
        organization_id,
        vehicle_id,
        document_name,
        expiry_date,
        status,
      ]
    );

    res.status(201).json({
      success: true,
      document: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const {
      vehicle_id,
      document_name,
      expiry_date,
      status,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE documents
      SET
      vehicle_id=$1,
      document_name=$2,
      expiry_date=$3,
      status=$4
      WHERE id=$5
      RETURNING *
      `,
      [
        vehicle_id,
        document_name,
        expiry_date,
        status,
        req.params.id,
      ]
    );

    res.json({
      success: true,
      document: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM documents WHERE id=$1",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Document deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};