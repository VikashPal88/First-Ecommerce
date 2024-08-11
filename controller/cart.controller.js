const Cart = require("../models/cart.models.js");

const fetchCartByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const cartItems = await Cart.find({ user: id })
      .populate("user")
      .populate("product");
    res.status(200).json(cartItems);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const addToCart = async (req, res) => {
  const { id } = req.user;
  const cart = new Cart({ ...req.body, user: id });
  console.log("cart", cart);
  try {
    const doc = await cart.save();
    const result = await doc.populate("product");
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteFromCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndDelete(id);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json(error);
  }
};

const updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("product");
    // const result = cart.populate("product");
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = { addToCart, fetchCartByUser, updateCart, deleteFromCart };
