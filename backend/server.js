import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv'
import { sql } from './config/db.js';
import { ajt } from './lib/arcjet.js';
import userRoute from './routes/userRoute.js';
import sellerRoute from './routes/sellerRoute.js';
import productRoute from './routes/productRoute.js';
import reviewRoute from './routes/reviewRoute.js';
import cartRoute from './routes/cartRoute.js';
import orderRoute from './routes/orderRoute.js';
import adminRoute from './routes/adminRoute.js';

dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);

app.use(express.json());
app.use(cors())
app.use(helmet());
app.use(morgan('dev'));


app.use(async (req, res, next) => {
  try {
    const decision = await ajt.protect(req, { requested: 1 })

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ success: false, message: "Too many requests" })
      }
      if (decision.reason.isBot()) {
        return res.status(403).json({ success: false, message: "Bot access denied" })
      }
      return res.status(403).json({ success: false, message: "Forbidden" })
    }

    return next()
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})


app.use("/api/users", userRoute);
app.use("/api/sellers", sellerRoute);
app.use("/api/products", productRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/admin", adminRoute);

async function initDB() {

  try {

    //user table
    await sql`
    CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    photo_url TEXT,
    role VARCHAR(50) DEFAULT 'user' NOT NULL, -- 'admin', 'vendor', 'user'
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    // Add address column if it doesn't exist (migration)
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT`;
    } catch (e) {
      console.log("Column address might already exist or error adding it:", e.message);
    }

    // sellers table
    await sql`
    CREATE TABLE IF NOT EXISTS sellers (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
      seller_email VARCHAR(255) NOT NULL,
      store_name VARCHAR(255) NOT NULL,
      store_category VARCHAR(100) NOT NULL,
      store_description TEXT,
      location VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    // products table
    await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      seller_id INTEGER REFERENCES sellers(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      image TEXT,
      price DECIMAL(10, 2) NOT NULL,
      unit VARCHAR(50) NOT NULL,
      description TEXT,
      quantity INTEGER DEFAULT 0,
      discount INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    // Add discount column if it doesn't exist (migration)
    try {
      await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS discount INTEGER DEFAULT 0`;
    } catch (e) {
      console.log("Column discount might already exist or error adding it:", e.message);
    }

    // reviews table
    await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    // price_history table
    await sql`
    CREATE TABLE IF NOT EXISTS price_history (
      id SERIAL PRIMARY KEY,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
      price DECIMAL(10, 2) NOT NULL,
      changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    // carts table
    await sql`
    CREATE TABLE IF NOT EXISTS carts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
      quantity INTEGER DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    // orders table
    await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
      total_amount DECIMAL(10, 2) NOT NULL,
      payment_method VARCHAR(50) NOT NULL, -- 'stripe', 'cod'
      payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'failed'
      order_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
      shipping_address TEXT NOT NULL,
      stripe_payment_intent_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    // order_items table
    await sql`
    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL,
      price DECIMAL(10, 2) NOT NULL
    )`;

    console.log("DB Initialized Successfully")

  } catch (error) {
    console.log("Error initDB", error)
  }
}
if (process.env.VERCEL) {
  // On Vercel, we can try to init DB but without blocking the export.
  // Ideally, migrations should be done separately, but we'll leave it fire-and-forget or top-level.
  // For safety, we just export app.
  initDB();
} else {
  initDB().then(() => {
    app.listen(PORT, () => {
      console.log("damaloy backend server running on port", PORT)
    });
  })
}

export default app;


app.get('/', (req, res) => {
  res.send('Hello, World!');
});