const router = require("express").Router();
const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const authMiddle = require("../middleware/authMiddle");
const UserModel = require("../models/UserModel");

//UPDATE USER PROPETY
router.put("/:id", authMiddle, async (req, res) => {
  if (req.body.id === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        res.status(500).send(err);
      }
    }
    try {
      // const UpUser =
      await userModel.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).send({ message: "User updated" });
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.status(500).send({ message: "You don't update other's profile" });
  }
});

//DELETE USER
//:id
// router.delete("/:id", authMiddle, async (req, res) => {
//   if (req.body.id === req.params.id || req.body.isAdmin) {
//     try {
//       const user = await userModel.findByIdAndDelete({ _id: req.params.id });
//       res.status(200).send({ message: "Account deleted succesfully", user });
//     } catch (err) {
//       res.status(500).send(err);
//     }
//   } else {
//     return res.status(403).send({ message: "you can't delete other account" });
//   }
// });

//GET ALL USER
router.get("/", async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

//GET USER
router.get("/getuser/:username", async (req, res) => {
  try {
    const user = await userModel.findOne({ username: req.params.username });
    res.status(200).send({
      message: "User info find succsessfuly ",
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).send({ message: err.message, data: err, success: false });
  }
});

//GET USER AUTHMIDDLE
router.get("/getuser", authMiddle, async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.id });
    res.status(200).send({
      message: "User info find succsessfuly ",
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).send({ message: err.message, data: err, success: false });
  }
});

router.get("/friends/:id", async (req, res) => {
  try {
    if (req.params.id) {
      const user = await UserModel.findById(req.params.id);
      const userFriends = await Promise.all(
        user.following.map((friendId) => {
          return UserModel.findById(friendId);
        })
      );
      let friendsAll = [];
      userFriends.map((friend) => {
        if (friend) {
          const { _id, profilePic, username } = friend;
          friendsAll.push({ _id, profilePic, username });
        }
      });
      res.status(200).send(friendsAll);
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.get("/friends/follower/:id", async (req, res) => {
  try {
    if (req.params.id) {
      const user = await UserModel.findById(req.params.id);
      const userFriends = await Promise.all(
        user.followers.map((friendId) => {
          return UserModel.findById(friendId);
        })
      );
      let friendsAll = [];
      userFriends.map((friend) => {
        if (friend) {
          const { _id, profilePic, username } = friend;
          friendsAll.push({ _id, profilePic, username });
        }
      });
      res.status(200).send(friendsAll);
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

//GET USER WITH ID
router.get("/getuser/withId/:id", async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.params.id });
    res.status(200).send({
      message: "User info find succsessfuly ",
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).send({ message: err.message, data: err, success: false });
  }
});

//FOLLOW USER
router.put("/follow/:id", authMiddle, async (req, res) => {
  if (req.body.id !== req.params.id) {
    try {
      const followtoUser = await userModel.findByIdAndUpdate({
        _id: req.params.id,
      });
      const fromfollowUser = await userModel.findByIdAndUpdate({
        _id: req.body.id,
      });
      if (!followtoUser.followers.includes(fromfollowUser._id)) {
        await followtoUser.updateOne({ $push: { followers: req.body.id } });
        await fromfollowUser.updateOne({ $push: { following: req.params.id } });

        res.status(200).send({ message: "User is following", followtoUser });
      } else {
        res.status(401).send("This user already following");
      }
    } catch (err) {
      res.status(403).send(err);
    }
  } else {
    return res.status(403).send("you can't follow your own account");
  }
});

//UNFOLLOW USER
router.put("/unfollow/:id", authMiddle, async (req, res) => {
  if (req.body.id !== req.params.id) {
    try {
      const followToUser = await userModel.findById({ _id: req.params.id });
      const fromfollowUser = await userModel.findById({ _id: req.body.id });
      if (followToUser.followers.includes(fromfollowUser._id)) {
        await followToUser.updateOne({ $pull: { followers: req.body.id } });
        await fromfollowUser.updateOne({ $pull: { following: req.params.id } });
        res
          .status(200)
          .send({ message: "This User is unfollowed", followToUser });
      } else {
        res.status(403).send("this user already isn't following");
      }
    } catch {}
  } else {
    res.status(403).send("you can't unfollow yourself");
  }
});
module.exports = router;
