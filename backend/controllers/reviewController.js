import { sql } from '../config/db.js';

export const addReview = async (req, res) => {
  const { product_id, user_id, rating, comment } = req.body;

  try {
    // Check user role
    const user = await sql`SELECT role FROM users WHERE user_id = ${user_id}`;
    if (user.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (user[0].role !== 'user') {
      return res.status(403).json({ success: false, message: "Only users can leave reviews." });
    }

    // Check if user has already reviewed this product
    const existingReview = await sql`
      SELECT * FROM reviews WHERE product_id = ${product_id} AND user_id = ${user_id}
    `;

    if (existingReview.length > 0) {
      return res.status(400).json({ success: false, message: "You have already reviewed this product." });
    }

    const newReview = await sql`
      INSERT INTO reviews (product_id, user_id, rating, comment)
      VALUES (${product_id}, ${user_id}, ${rating}, ${comment})
      RETURNING *
    `;

    // Fetch user details to return with the review
    const reviewWithUser = await sql`
      SELECT r.*, u.name as user_name, u.photo_url as user_photo
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.id = ${newReview[0].id}
    `;

    res.status(201).json({
      success: true,
      message: "Review added successfully!",
      data: reviewWithUser[0]
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getReviews = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await sql`
      SELECT r.*, u.name as user_name, u.photo_url as user_photo
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.product_id = ${productId}
      ORDER BY r.created_at DESC
    `;

    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment, user_id } = req.body;

  try {
    const review = await sql`SELECT * FROM reviews WHERE id = ${id}`;

    if (review.length === 0) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review[0].user_id != user_id) {
      return res.status(403).json({ success: false, message: "You can only update your own review." });
    }

    const updatedReview = await sql`
      UPDATE reviews
      SET rating = ${rating}, comment = ${comment}
      WHERE id = ${id}
      RETURNING *
    `;

    // Fetch user details to return with the review
    const reviewWithUser = await sql`
      SELECT r.*, u.name as user_name, u.photo_url as user_photo
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.id = ${updatedReview[0].id}
    `;

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: reviewWithUser[0]
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body; // Pass user_id in body for verification

  try {
    const review = await sql`SELECT * FROM reviews WHERE id = ${id}`;

    if (review.length === 0) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review[0].user_id != user_id) {
      return res.status(403).json({ success: false, message: "You can only delete your own review." });
    }

    await sql`DELETE FROM reviews WHERE id = ${id}`;

    res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
