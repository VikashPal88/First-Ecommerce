const User = require("../models/user.model");

const fetchUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).exec();
    res.status(400).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

// const createUser = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const user = await User.findByIdAndUpdate(id, req.body, { new: true });
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(400).json(error);
//   }
// };

const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(201).jso(user);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = { fetchUserById, updateUser };
