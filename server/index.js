const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { config } = require("dotenv");
config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const userRoute = require("./controllers/users.controller");
const transactionRoute = require("./routes/transaction.route");

// global error handler
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || "error",
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

//routes
// app.use("/user", userRoute);
app.use("/transaction", transactionRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connect sucsess");
  })
  .catch((e) => {
    console.log(`error with connect db is ${e}`);
  });

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
