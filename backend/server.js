// ----------------------
// server.js
// ----------------------

const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const startSocketServer = require("./socketServer");

// ----------------------
// Load environment variables
// ----------------------
dotenv.config(); // .env should be in the same folder as server.js
console.log("MONGO_URI from .env =>", process.env.MONGO_URI);

// ----------------------
// Connect to MongoDB
// ----------------------
connectDB(); // This should use the updated connectDB.js (no unsupported options)

// ----------------------
// Initialize Express App
// ----------------------
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// ----------------------
// API Routes
// ----------------------
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ----------------------
// Error Handling Middleware
// ----------------------
app.use(notFound);
app.use(errorHandler);

// ----------------------
// Start Server with Socket.IO
// ----------------------
const PORT = process.env.PORT || 5001;
const server = http.createServer(app);

// Initialize socket server
startSocketServer(server);

// Listen on PORT
server.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});
