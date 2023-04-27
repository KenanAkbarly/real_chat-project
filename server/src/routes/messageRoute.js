const express = require("express");
const messageModel = require("../models/MessageModel.js");

const router = express.Router();

router.post("/", async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const newMessage = new messageModel({
    chatId,
    senderId,
    text,
  });
  try {
    const result = await newMessage.save();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:chatId", async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await messageModel.find({ chatId });
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
