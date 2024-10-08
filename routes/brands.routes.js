const express = require("express");
const { fetchBrands, createBrand } = require("../controller/brand.controller");

const router = express.Router();

router.get("/", fetchBrands).post("/", createBrand);
exports.router = router;
