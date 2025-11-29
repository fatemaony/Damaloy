import { sql } from '../config/db.js';

export const createSellerApplication = async (req, res) => {
  const { user_id, seller_email, store_name, store_category, store_description, location, phone } = req.body;

  try {

    const existingApplication = await sql`
      SELECT * FROM sellers WHERE user_id = ${user_id}
    `;

    if (existingApplication.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a seller application."
      });
    }

    const newApplication = await sql`
      INSERT INTO sellers (user_id,seller_email, store_name, store_category, store_description, location, phone)
      VALUES (${user_id},${seller_email}, ${store_name}, ${store_category}, ${store_description}, ${location}, ${phone})
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      data: newApplication[0]
    });

  } catch (error) {
    console.error("Error creating seller application:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get all applications (for Admin)
// Get all applications (for Admin)
// Get all applications (for Admin)
// Get all applications (for Admin)
export const getAllApplications = async (req, res) => {
  const { status, exclude_status } = req.query;

  try {
    let query = sql`
      SELECT 
        s.*,
        u.name as seller_name,
        COUNT(p.id) as product_count
      FROM sellers s
      JOIN users u ON s.user_id = u.user_id
      LEFT JOIN products p ON s.id = p.seller_id
    `;

    if (status) {
      query = sql`${query} WHERE s.status = ${status}`;
    } else if (exclude_status) {
      query = sql`${query} WHERE s.status != ${exclude_status}`;
    }

    query = sql`${query} 
      GROUP BY s.id, u.name
      ORDER BY s.created_at DESC
    `;

    const applications = await query;

    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



// Update application status (Approve/Reject)
export const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedApplication = await sql`
      UPDATE sellers
      SET status = ${status}
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedApplication.length === 0) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // If approved, update user role to vendor
    if (status === 'approved') {
      const userId = updatedApplication[0].user_id;
      await sql`
            UPDATE users
            SET role = 'seller'
            WHERE user_id = ${userId}
        `;
    }

    res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      data: updatedApplication[0]
    });


  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getSellerByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const seller = await sql`SELECT * FROM sellers WHERE seller_email = ${email}`;
    if (seller.length === 0) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }
    res.status(200).json({ success: true, data: seller[0] });
  } catch (error) {
    console.error("Error fetching seller by email:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteSeller = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSeller = await sql`
      DELETE FROM sellers WHERE id = ${id}
      RETURNING *
    `;

    if (deletedSeller.length === 0) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    res.status(200).json({
      success: true,
      message: "Seller deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting seller:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
