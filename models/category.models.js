const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  label: { type: String, requried: true, unique: true },
  value: { type: String, requried: true, unique: true },
});

categorySchema.virtual("id").get(function () {
  return this._id;
});

categorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
