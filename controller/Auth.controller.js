const User = require("../models/user.model");

const createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    const doc = await user.save();
    res.status(201).json({ id: doc.id, role: doc.role });
  } catch (error) {
    res.status(400).json(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();

    // thisis just temporary we will use string password auth
    if (!user) {
      res.status(401).json({ message: "no such user email" });
    } else if (user.password === req.body.password) {
      // TODO we will make
      res.status(200).json({
        id: user.id,
        role: user.role,
      });
    } else {
      res.status(401).json({ messgae: "invalid credentials" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = { createUser, loginUser };
