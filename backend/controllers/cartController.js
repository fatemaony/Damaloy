import { sql } from '../config/db.js';

export const addToCart = async (req, res) => {
  const { product_id, quantity, user_id } = req.body;

  try {
    // Check if item already exists in cart
    const existingItem = await sql`
      SELECT * FROM carts 
      WHERE user_id = ${user_id} AND product_id = ${product_id}
    `;

    if (existingItem.length > 0) {
      // Update quantity
      const newQuantity = existingItem[0].quantity + (quantity || 1);
      const updatedItem = await sql`
        UPDATE carts 
        SET quantity = ${newQuantity}
        WHERE id = ${existingItem[0].id}
        RETURNING *
      `;
      return res.status(200).json({ success: true, message: "Cart updated", data: updatedItem[0] });
    } else {
      // Add new item
      const newItem = await sql`
        INSERT INTO carts (user_id, product_id, quantity)
        VALUES (${user_id}, ${product_id}, ${quantity || 1})
        RETURNING *
      `;
      return res.status(201).json({ success: true, message: "Added to cart", data: newItem[0] });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cartItems = await sql`
      SELECT c.*, p.name, p.image, p.price, p.unit, s.store_name
      FROM carts c
      LEFT JOIN products p ON c.product_id = p.id
      LEFT JOIN sellers s ON p.seller_id = s.id
      WHERE c.user_id = ${userId}
      ORDER BY c.created_at DESC
    `;

    res.status(200).json({ success: true, data: cartItems });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const updatedItem = await sql`
      UPDATE carts 
      SET quantity = ${quantity}
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedItem.length === 0) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.status(200).json({ success: true, message: "Cart updated", data: updatedItem[0] });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteCartItem = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await sql`
      DELETE FROM carts 
      WHERE id = ${id}
      RETURNING *
    `;

    if (deletedItem.length === 0) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.status(200).json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const clearCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedItems = await sql`
      DELETE FROM carts 
      WHERE user_id = ${userId}
      RETURNING *
    `;

    res.status(200).json({ success: true, message: "Cart cleared", data: deletedItems });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
