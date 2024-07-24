const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRouters = require("./routes/products.routes");
const categoriesRouters = require("./routes/category.routes");
const brandsRouters = require("./routes/brands.routes");
const usersRouter = require("./routes/user.routes");
const authRouter = require("./routes/Auth.routes");
const cartRouter = require("./routes/cart.routes");
const orderRouter = require("./routes/order.routes");
const app = express();
const PORT = 8080;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/mern-project-backend");
  console.log("database connected");
}

// middlewears

app.use(
  cors({
    exposedHeaders: ["X-Total-count"],
  })
);
app.use(express.json()); //to parse req.body
app.use("/products", productRouters.router);
app.use("/categories", categoriesRouters.router);
app.use("/brands", brandsRouters.router);
app.use("/users", usersRouter.router);
app.use("/auth", authRouter.router);
app.use("/cart", cartRouter.router);
app.use("/orders", orderRouter.router);

app.get("/", (req, res) => {
  res.json({ status: "success" });
});

// app.post("/products", createProduct);

app.listen(PORT, () => {
  console.log("sserver is started");
});
