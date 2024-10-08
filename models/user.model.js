const mongoose = require("mongoose");

const Mixed = mongoose.Schema.Types.Mixed;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: Buffer,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "user",
  },
  name: {
    type: String,
  },
  orders: { type: [Mixed] },
  addresses: {
    type: [Mixed],
    default: [],
  },
  salt: Buffer,
});

userSchema.virtual("id").get(function () {
  return this._id;
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
