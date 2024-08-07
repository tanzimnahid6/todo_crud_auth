const express = require("express");
const mongoose = require("mongoose");
const todoHandler = require("./routeHandler/todoHandler");
const userHandler = require("./routeHandler/userHandler");
const port = 9000;

// express app initialize
const app = express();
app.use(express.json());

// connect application to database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected successful...");
  })
  .catch((err) => {
    console.log(`connection error:---`, err);
  });

// application todo route
app.use("/todo", todoHandler);
// application user rouet
app.use("/user", userHandler);

//default error handler
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err, success: false  });
}

app.use(errorHandler);

app.listen(port, () => {
  console.log("App listening on the port", port);
});
