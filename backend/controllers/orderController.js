import { sql } from "../config/db.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
  try {
    const { user_id, payment_method, shipping_address } = req.body;

    if (!user_id || !payment_method || !shipping_address) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // 1. Get cart items
    const cartItems = await sql`
      SELECT c.product_id, c.quantity, p.price, p.name, p.seller_id
      FROM carts c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ${user_id}
    `;

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // 2. Calculate total amount
    const totalAmount = cartItems.reduce(
      (acc, item) => acc + parseFloat(item.price) * item.quantity,
      0
    );

    let stripePaymentIntentId = null;
    let paymentStatus = "pending";

    // 3. Handle Stripe Payment
    if (payment_method === "stripe") {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(totalAmount * 100), // Stripe expects amount in cents
          currency: "usd",
          metadata: { user_id: user_id.toString() },
        });
        stripePaymentIntentId = paymentIntent.client_secret; // Send client secret to frontend
      } catch (error) {
        console.error("Stripe Error:", error);
        return res
          .status(500)
          .json({ success: false, message: "Payment processing failed" });
      }
    }

    // 4. Create Order
    const [newOrder] = await sql`
      INSERT INTO orders (
        user_id, total_amount, payment_method, payment_status, shipping_address, stripe_payment_intent_id
      ) VALUES (
        ${user_id}, ${totalAmount}, ${payment_method}, ${paymentStatus}, ${shipping_address}, ${stripePaymentIntentId}
      ) RETURNING *
    `;

    // 5. Create Order Items
    for (const item of cartItems) {
      await sql`
        INSERT INTO order_items (
          order_id, product_id, quantity, price
        ) VALUES (
          ${newOrder.id}, ${item.product_id}, ${item.quantity}, ${item.price}
        )
      `;

      // Optional: Update product stock here if needed
      await sql`
        UPDATE products
        SET quantity = quantity - ${item.quantity}
        WHERE id = ${item.product_id}
      `;
    }

    // 6. Clear Cart
    await sql`DELETE FROM carts WHERE user_id = ${user_id}`;

    // 7. Update User Address (Optional, but good for UX)
    await sql`
        UPDATE users SET address = ${shipping_address} WHERE user_id = ${user_id}
    `;

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: newOrder,
      clientSecret: stripePaymentIntentId, // For Stripe frontend
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch orders with items
    const ordersWithItems = await sql`
      SELECT 
        o.id, o.user_id, o.total_amount, o.payment_method, o.payment_status, o.order_status, o.shipping_address, o.created_at,
        oi.product_id, oi.quantity, oi.price,
        p.name as product_name, p.image as product_image
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ${userId}
      ORDER BY o.created_at DESC
    `;

    // Group items by order
    const ordersMap = new Map();

    ordersWithItems.forEach(row => {
      if (!ordersMap.has(row.id)) {
        ordersMap.set(row.id, {
          id: row.id,
          user_id: row.user_id,
          total_amount: row.total_amount,
          payment_method: row.payment_method,
          payment_status: row.payment_status,
          order_status: row.order_status,
          shipping_address: row.shipping_address,
          created_at: row.created_at,
          items: []
        });
      }

      if (row.product_id) {
        ordersMap.get(row.id).items.push({
          product_id: row.product_id,
          quantity: row.quantity,
          price: row.price,
          product_name: row.product_name,
          product_image: row.product_image
        });
      }
    });

    const orders = Array.from(ordersMap.values());

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const ordersWithItems = await sql`
      SELECT 
        o.id, o.user_id, o.total_amount, o.payment_method, o.payment_status, o.order_status, o.shipping_address, o.created_at,
        u.name as user_name, u.email as user_email,
        oi.product_id, oi.quantity, oi.price,
        p.name as product_name, p.image as product_image
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      ORDER BY o.created_at DESC
    `;

    // Group items by order
    const ordersMap = new Map();

    ordersWithItems.forEach(row => {
      if (!ordersMap.has(row.id)) {
        ordersMap.set(row.id, {
          id: row.id,
          user_id: row.user_id,
          user_name: row.user_name,
          user_email: row.user_email,
          total_amount: row.total_amount,
          payment_method: row.payment_method,
          payment_status: row.payment_status,
          order_status: row.order_status,
          shipping_address: row.shipping_address,
          created_at: row.created_at,
          items: []
        });
      }

      if (row.product_id) {
        ordersMap.get(row.id).items.push({
          product_id: row.product_id,
          quantity: row.quantity,
          price: row.price,
          product_name: row.product_name,
          product_image: row.product_image
        });
      }
    });

    const orders = Array.from(ordersMap.values());

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [updatedOrder] = await sql`
      UPDATE orders
      SET order_status = ${status}
      WHERE id = ${id}
      RETURNING *
    `;

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Order status updated", data: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
