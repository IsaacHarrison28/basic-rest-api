const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  price: Number,
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
