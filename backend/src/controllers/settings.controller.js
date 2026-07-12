import pool from "../config/db.js";

export const getSettings = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM organization_settings
      LIMIT 1
      `
    );

    res.json({
      success: true,
      settings: result.rows[0] || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const {
      organization_id,
      company_email,
      company_phone,
      company_address,
      timezone,
    } = req.body;

    const existing = await pool.query(
      `
      SELECT *
      FROM organization_settings
      WHERE organization_id=$1
      `,
      [organization_id]
    );

    let result;

    if (existing.rows.length === 0) {
      result = await pool.query(
        `
        INSERT INTO organization_settings
        (
          organization_id,
          company_email,
          company_phone,
          company_address,
          timezone
        )
        VALUES
        ($1,$2,$3,$4,$5)
        RETURNING *
        `,
        [
          organization_id,
          company_email,
          company_phone,
          company_address,
          timezone,
        ]
      );
    } else {
      result = await pool.query(
        `
        UPDATE organization_settings
        SET
          company_email=$1,
          company_phone=$2,
          company_address=$3,
          timezone=$4
        WHERE organization_id=$5
        RETURNING *
        `,
        [
          company_email,
          company_phone,
          company_address,
          timezone,
          organization_id,
        ]
      );
    }

    res.json({
      success: true,
      settings: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};