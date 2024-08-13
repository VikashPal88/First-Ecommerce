const Cart = require("../models/cart.models.js");
const Order = require("../models/order.models.js");

const fetchOrderByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const orders = await Order.find({ user: id });
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const createOrder = async (req, res) => {
  const order = new Order(req.body);
  console.log("order", order);
  try {
    const doc = await order.save();
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json(error);
  }
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json(error);
  }
};

const fetchAllOrders = async (req, res) => {
  let query = Order.find({});
  let totalOrdersQuery = Order.find({});

  if (req.query.category) {
    query = query.find({ category: req.query.category });
    totalOrdersQuery = totalOrdersQuery.find({
      category: req.query.category,
    });
  }
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    totalOrdersQuery = totalOrdersQuery.find({ category: req.query.brand });
  }
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query_sort]: req.query._order });
  }
  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  const totalDocs = await totalOrdersQuery.count().exec();
  console.log({ totalDocs });

  try {
    const docs = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    console.log({ err });
    res.status(400).json(err);
  }
};

module.exports = {
  fetchOrderByUser,
  updateOrder,
  createOrder,
  deleteOrder,
  fetchAllOrders,
};
