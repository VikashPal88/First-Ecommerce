const express = require("express");
const {
  fetchCategory,
  createCategory,
} = require("../controller/category.controller");

const router = express.Router();

router.get("/", fetchCategory).post("/", createCategory);

exports.router = router;
