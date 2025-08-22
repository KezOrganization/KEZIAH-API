import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { seedAdmin } from "./Middleware/Admin_seeder.js";
import router from "./Routes/User_route.js";
import cartRoute from "./Routes/Cart_route.js";
import productRoute from "./Routes/Product_routes.js";
import paymentRouter from "./Routes/Payment_route.js";

dotenv.config();

const app = express();


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Database connected");
    await seedAdmin(); 
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// Middleware

app.use(express.json());
app.use(cors());

// Session Setup
app.use(session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));



// API Routes
app.use('/api/auth', router);
app.use('/api/cart', cartRoute);
app.use('/api/products', productRoute)
app.use('/payment', paymentRouter)
// Global Error Handler

app.use((err, req, res, next) => {
  console.error('error', err.stack);
  res.status(500).json({
    message: 'Server Error',
    error: err.message,
  });
});


// Start Server

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
