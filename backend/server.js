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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    console.log("DB Initialized Successfully")

  } catch (error) {
    console.log("Error initDB", error)
  }
}
initDB().then(() => {
  app.listen(PORT, () => {
    console.log("damaloy backend server running on port", PORT)
  });
})


app.get('/', (req, res) => {
  res.send('Hello, World!');
});