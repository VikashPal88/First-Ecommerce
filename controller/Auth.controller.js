const User = require("../models/user.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const { sanitizeUser } = require("../services/common");

const createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      31000,
      32,
      "sha256",
      async (err, hashedPassword) => {
        const user = new User({
          ...req.body,
          password: hashedPassword,
          salt,
        });
        const doc = await user.save();
        req.login(sanitizeUser(doc), (err) => {
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(
              sanitizeUser(user),
              process.env.JWT_SECRET_KEY
            );
            res
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              })
              .status(201)
              .json({ token });
          }
        });
      }
    );
  } catch (error) {
    res.status(400).json(error);
  }
};

const loginUser = async (req, res) => {
  const user = req.user;
  res
    .cookie("jwt", user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(200)
    .json(user);
};

const checkAuth = async (req, res) => {
  const user = req.user;
  console.log("checauth", user);
  if (req.user) {
    console.log("user", user);
    res.json(user);
  } else {
    res.sendStatus(401);
  }
};

module.exports = { createUser, loginUser, checkAuth };
