const express = require("express");
const router = express.Router();
const Product = require("../models/products");
const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id rating")
    .exec()
    .then((items) => {
      const response = {
        count: items.length,
        products: items.map((itemsData) => {
          return {
            _id: itemsData._id,
            name: itemsData.name,
            price: itemsData.price,
            rating: itemsData.rating,
            request: {
              type: "GET",
              url: `localhost:5000/products/${itemsData._id}`,
            },
          };
        }),
      };
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", (req, res, next) => {
  const product = {
    name: req.body.name,
    price: req.body.price,
    rating: req.body.rating,
  };
  //register the instance of the product to database
  const productInstance = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    rating: req.body.rating,
  });
  productInstance
    .save()
    .then((result) => {
      res.status(200).json({
        productInfo: result,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

router.get("/:product_id", (req, res, next) => {
  const id = req.params.product_id;
  Product.findById(id)
    .exec()
    .then((responseDoc) => {
      res.status(200).json(responseDoc);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then((response) => {
      if (response) {
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "The item you are tyring to delete does not exist!",
        });
      }
    })
    .catch((err) => res.status(500).json(err));
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;

  Product.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name: req.body.names,
        price: req.body.price,
      },
    }
  )
    .exec()
    .then((item) => {
      res.status(200).json({
        updatedItem: item,
      });
    })
    .catch((err) => {
      res.status(500).json({
        Error: err,
      });
    });
});

module.exports = router;
