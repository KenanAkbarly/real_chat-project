const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const PORT = 8080;
const routeUser = require("./src/routes/users");
const routeAuth = require("./src/routes/auth");
const postRoute = require("./src/routes/post");
const chatRoute = require("./src/routes/chatRoute");
const messageRoute = require("./src/routes/messageRoute.js");

const connect = require("./src/database/connect");
const PostModel = require("./src/models/PostModel");

const app = express();
mongoose.set("strictQuery", false);

connect().then(() => {
  console.log("Connected with DataBase");
});

//MIDDLEWARE
app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.use(express.json({ limit: "25mb" }));

// UPLOAD IMG API
// app.post("/api/upload", async (req, res) => {
//   const newImg = await new PostModel({
//     img: req.body,
//   });
//   try {
//     await newImg.save();
//     res.status(200).send({ message: "Img uploaded" });
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// });
// //ROUTES
app.use("/api/users", routeUser);

app.use("/api/auth", routeAuth);

app.use("/api/posts", postRoute);

app.use("/api/chat", chatRoute);

app.use("/api/message", messageRoute);

app.listen(PORT, () => {
  console.log("Server is running");
});
