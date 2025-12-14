const express = require("express");
const connectDB = require("./config/db");
// const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
const dotenv = require("dotenv").config({ path: './backend/.env' });
// dotenv.config();     // Load .env
console.log("MONGO_URI from .env =>", process.env.MONGO_URI);
connectDB();         // Connect to DB

const cors = require("cors");

const app = express();
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // to accept JSON data

// Routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Middleware
app.use(notFound);
app.use(errorHandler);

const http = require("http");
const startSocketServer = require("./socketServer");

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);

startSocketServer(server);

server.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});
