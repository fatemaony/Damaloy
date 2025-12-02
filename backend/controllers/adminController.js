import { sql } from "../config/db.js";

export const getAdminStats = async (req, res) => {
  try {
    // 1. Total Users (role = 'user')
    const totalUsersResult = await sql`
      SELECT COUNT(*) as count FROM users WHERE role = 'user'
    `;
    const totalUsers = parseInt(totalUsersResult[0].count);

    // 2. Total Sellers
    const totalSellersResult = await sql`
      SELECT COUNT(*) as count FROM sellers
    `;
    const totalSellers = parseInt(totalSellersResult[0].count);

    // 3. Total Products
    const totalProductsResult = await sql`
      SELECT COUNT(*) as count FROM products
    `;
    const totalProducts = parseInt(totalProductsResult[0].count);

    // 4. Total Revenue (sum of total_amount from orders)
    const totalRevenueResult = await sql`
      SELECT COALESCE(SUM(total_amount), 0) as total FROM orders
    `;
    const totalRevenue = parseFloat(totalRevenueResult[0].total);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalSellers,
        totalProducts,
        totalRevenue
      }
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
