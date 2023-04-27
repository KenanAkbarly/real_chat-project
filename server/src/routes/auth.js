const router = require("express").Router();
const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const existUser = await UserModel.findOne({ email: req.body.email });

    // VERIFY USER
    if (existUser)
      return res
        .status(403)
        .send({ success: false, message: "This user already exist" });

    //HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);

    const newUser = await new UserModel({
      ...req.body,
      password: hashPass,
    });

    await newUser.save();
    res.status(200).send({ succsess: true, message: "user created", newUser });
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message, data: error, success: false });
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "Email is incorrect" });

    const correctPass = await bcrypt.compare(req.body.password, user.password);
    if (!correctPass)
      return res
        .status(404)
        .send({ success: false, message: "password is incorrect" });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_KEY,
      {
        expiresIn: "1d",
      }
    );
    res
      .status(200)
      .send({ message: "User is loged in", success: true, data: token, user });
  } catch (err) {
    res.status(500).send({ message: err.message, data: err, success: false });
  }
});

module.exports = router;
