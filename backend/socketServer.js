const socketio = require("socket.io");

const startSocketServer = (server) => {
  const io = socketio(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User joined room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;

      if (!chat.users) return console.log("chat.users not defined");

      chat.users.forEach((user) => {
        if (user._id === newMessageRecieved.sender._id) return;

        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
      socket.leave();
    });
  });
};
module.exports = startSocketServer;