const express = require("express");
const {
  fetchOrderByUser,
  createOrder,
  deleteOrder,
  updateOrder,
  fetchAllOrders,
} = require("../controller/order.controller.js");

const router = express.Router();

router
  .get("/user/:userId", fetchOrderByUser)
  .post("/", createOrder)
  .delete("/:id", deleteOrder)
  .patch("/:id", updateOrder)
  .get("/", fetchAllOrders);
exports.router = router;
