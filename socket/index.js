const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //USER CONNECT
  console.log("user connected ");

  // TAKE USER ID
  socket.on("addUser", (userId) => {
    console.log(userId);
    if (userId) {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    }
  });

  //SEND AND GET MESSAGE
  socket.on("sendMessage", ({ senderId, recevierId, text }) => {
    if (recevierId) {
      let user = getUser(recevierId);

      console.log(user);
      if (user) {
        io.to(user.socketId).emit("getMessage", {
          senderId,
          text,
        });
      }
    } else console.log("reciver yoxdur");
  });

  //DISCONNECT
  socket.on("disconnect", () => {
    console.log("User disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
