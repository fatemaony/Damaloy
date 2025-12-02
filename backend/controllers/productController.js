import { sql } from '../config/db.js';

export const createProduct = async (req, res) => {
  const { name, image, price, unit, description, quantity, seller_id } = req.body;

  try {
    const newProduct = await sql`
      INSERT INTO products (name, image, price, unit, description, quantity, seller_id)
      VALUES (${name}, ${image}, ${price}, ${unit}, ${description}, ${quantity || 0}, ${seller_id})
      RETURNING *
    `;

    // Log initial price
    if (newProduct.length > 0) {
      await sql`
        INSERT INTO price_history (product_id, price)
        VALUES (${newProduct[0].id}, ${price})
      `;
    }

    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      data: newProduct[0]
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllProducts = async (req, res) => {
  const { search, category, seller_id, page = 1, limit = 12 } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = sql`
      SELECT p.*, s.store_name, s.store_category, s.location, s.seller_email,
      (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE product_id = p.id) as average_rating,
      (SELECT COUNT(*) FROM reviews WHERE product_id = p.id) as review_count
      FROM products p
      JOIN sellers s ON p.seller_id = s.id
    `;

    const conditions = [];

    if (search) {
      conditions.push(sql`p.name ILIKE ${'%' + search + '%'}`);
    }

    if (category) {
      conditions.push(sql`s.store_category = ${category}`);
    }

    if (seller_id) {
      conditions.push(sql`p.seller_id = ${seller_id}`);
    }

    if (conditions.length > 0) {
      query = sql`${query} WHERE ${conditions.reduce((acc, curr, i) => i === 0 ? curr : sql`${acc} AND ${curr}`, sql``)}`;
    }

    query = sql`${query} ORDER BY p.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const products = await query;

    // Get total count for pagination
    let countQuery = sql`
      SELECT COUNT(*) 
      FROM products p
      JOIN sellers s ON p.seller_id = s.id
    `;

    if (conditions.length > 0) {
      countQuery = sql`${countQuery} WHERE ${conditions.reduce((acc, curr, i) => i === 0 ? curr : sql`${acc} AND ${curr}`, sql``)}`;
    }

    const totalCountResult = await countQuery;
    const totalProducts = parseInt(totalCountResult[0].count);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await sql`
      SELECT p.*, s.store_name, s.location, s.seller_email, s.phone
      FROM products p
      JOIN sellers s ON p.seller_id = s.id
      WHERE p.id = ${id}
    `;

    if (product.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      data: product[0]
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, image, price, unit, description, quantity } = req.body;

  try {
    const updatedProduct = await sql`
      UPDATE products
      SET name = ${name}, image = ${image}, price = ${price}, unit = ${unit}, description = ${description}, quantity = ${quantity}
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedProduct.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }



    const lastPrice = await sql`
      SELECT price FROM price_history 
      WHERE product_id = ${id} 
      ORDER BY changed_at DESC 
      LIMIT 1
    `;

    if (lastPrice.length === 0 || parseFloat(lastPrice[0].price) !== parseFloat(price)) {
      await sql`
        INSERT INTO price_history (product_id, price)
        VALUES (${id}, ${price})
      `;
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct[0]
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await sql`
      DELETE FROM products WHERE id = ${id}
      RETURNING *
    `;

    if (deletedProduct.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getPriceHistory = async (req, res) => {
  const { id } = req.params;

  try {
    const history = await sql`
      SELECT * FROM price_history
      WHERE product_id = ${id}
      ORDER BY changed_at ASC
    `;

    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error("Error fetching price history:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getTopProducts = async (req, res) => {
  try {
    const topProducts = await sql`
      SELECT p.*, 
             COALESCE(SUM(oi.quantity), 0) as total_sold
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      GROUP BY p.id
      ORDER BY total_sold DESC, p.created_at DESC
      LIMIT 8
    `;

    res.status(200).json({
      success: true,
      data: topProducts
    });
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
