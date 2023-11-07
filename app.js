require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const productsRouter = require("./api/routes/products");

const app = express();
mongoose.connect(
  `mongodb+srv://sateonlineservices:${process.env.AccessPassword}@acad-node-js-practice.xu0gemh.mongodb.net/?retryWrites=true&w=majority`
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Before routes add headers to handle CORS errors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); //The * allows any url to access our API but if you want
  //to explicitly allow a certain url only, add it in place of * and it'll allow only that url
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, DELETE, POST, PATCH, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productsRouter);

//Error handling
app.use((req, res, next) => {
  const error = new Error("resource not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
