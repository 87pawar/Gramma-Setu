// const User=require("./Models/User.js");

const authRoutes=require("./Routes/authRouters.js");
// const Controller=require("./Controller/authController.js");
const workerRoutes = require("./Routes/workerRoutes.js");
const serviceRequestRoutes = require("./Routes/serviceRequestRoutes.js");
const reviewRoutes = require("./Routes/reviewRoutes.js");
const notificationRoutes = require("./Routes/notificationRoutes.js");
// Import admin routes
const adminRoutes = require("./Routes/adminRoutes.js");
const { generalLimiter } = require("./Middleware/rateLimitMiddleware.js");
const { errorMiddleware } = require("./Middleware/errorMiddleware.js");
const cors = require("cors");
const helmet = require("helmet");


//read .envfile
require("dotenv").config();
//import express
const express=require("express");
const mongoose = require("mongoose");



// create app
const app=express();
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL
}));
//json middleware
app.use(express.json());
//create route
app.get("/",(req,res) => {
    res.send("backend running:");
});

// Connect to MongoDB using the connection URI
// stored in the MONGO_URI environment variable
mongoose.connect(process.env.MONGO_URI, {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });
app.get("/about",(req,res)=>{
    res.send("about");
});
// Use authRoutes and etc for all requests that start with /api/auth or any other
app.use("/api/auth", authRoutes);
app.use("/api/workers",generalLimiter, workerRoutes);
app.use("/api/service-requests",generalLimiter, serviceRequestRoutes);
app.use("/api/reviews", generalLimiter,reviewRoutes);
// Serve uploaded files from the "uploads" folder

// Example:

// /uploads/profile.jpg

// will access:

// Backend/uploads/profile.jpg

app.use("/uploads", express.static("uploads"));
app.use("/api/notifications",generalLimiter, notificationRoutes);
// Admin API routes
// All admin endpoints will start with /api/admin
app.use("/api/admin",generalLimiter, adminRoutes);
// Centralized error handling middleware
app.use(errorMiddleware);
// Handle unknown routes
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;

  next(error);
});

// Centralized error handling middleware
app.use(errorMiddleware);
app.use(express.json());



const PORT = process.env.PORT || 5400;
app.listen(PORT,()=>{
    console.log(`server running on http://localhost:${PORT}`);
});