const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: {
    type: [mongoose.Schema.Types.Mixed],
    required: true,
  },
  totalAmount: {
    type: Number,
  },
  totalItemC: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // we can add enum types
  paymentMethod: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  selectedAddress: {
    type: [mongoose.Schema.Types.Mixed],
    required: true,
  },
});

orderSchema.virtual("id").get(function () {
  return this._id;
});

orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
