const express = require("express");
const chatModel = require("../models/ChatModel.js");

const router = express.Router();

router.post("/", async (req, res) => {
  const findUser = await chatModel.findOne({
    members: { $all: [req.body.senderId, req.body.receiverId] },
  });
  if (findUser) {
    res.status(403).send({ message: "This chat exist" });
  } else {
    const newChat = new chatModel({
      members: [req.body.senderId, req.body.receiverId],
    });
    try {
      const result = await newChat.save();
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const chat = await chatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).send(chat);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/find/:firstId/:secondId", async (req, res) => {
  try {
    const chat = await chatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).send(chat);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
