import { sql } from '../config/db.js';

export const createProduct = async (req, res) => {
  const { name, image, price, unit, description, quantity, seller_id } = req.body;

  try {
    const newProduct = await sql`
      INSERT INTO products (name, image, price, unit, description, quantity, seller_id)
      VALUES (${name}, ${image}, ${price}, ${unit}, ${description}, ${quantity || 0}, ${seller_id})
      RETURNING *
    `;

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
  const { search, category } = req.query;

  try {
    let query = sql`
      SELECT p.*, s.store_name, s.store_category, s.location, s.seller_email
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

    if (conditions.length > 0) {
      query = sql`${query} WHERE ${conditions.reduce((acc, curr, i) => i === 0 ? curr : sql`${acc} AND ${curr}`, sql``)}`;
    }

    query = sql`${query} ORDER BY p.created_at DESC`;

    const products = await query;

    res.status(200).json({
      success: true,
      data: products
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
      SELECT * FROM products WHERE id = ${id}
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
