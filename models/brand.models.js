const mongoose = require("mongoose");

const brandSchema = mongoose.Schema({
  label: { type: String, requried: true, unique: true },
  value: { type: String, requried: true, unique: true },
});

brandSchema.virtual("id").get(function () {
  return this._id;
});

brandSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Brand = mongoose.model("brand", brandSchema);

module.exports = Brand;
