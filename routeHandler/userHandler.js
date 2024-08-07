const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("User", userSchema);
const bcrypt = require("bcrypt");

const JWT = require("jsonwebtoken");
const saltround = 5;
require("dotenv").config();
//route handlerls

//signup route
router.post("/signup", async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, saltround);
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPass,
    };
    const user = await User.create(newUser);
    res
      .status(200)
      .json({ message: "user sign up successfully", success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occures to signup",
      error,
    });
  }
});

//login route
router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ email: req.body.email });

    if (user && user.length > 0) {
      const isValidatePassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );

      if (isValidatePassword) {
        const token = JWT.sign(
          {
            userName: user[0].name,
            userId: user[0]._id,
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "10h",
          }
        );
        res
          .status(200)
          .json({ message: "User found", success: true, user, token: token });
      } else {
        res
          .status(401)
          .json({ message: "Authenticate failed", success: false });
      }
    } else {
      res.status(401).json({ message: "Authenticate failed", success: false });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Authenticate failed",
      error,
    });
  }
});

module.exports = router;
