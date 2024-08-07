const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const todoSchema = require("../schemas/todoSchemas");
const checkAuth = require("../middleware/checkAuth");

const Todo = new mongoose.model("Todo", todoSchema);

// Get all todos ------------------this is protected route
router.get("/", checkAuth, async (req, res) => {
  try {
    const todos = await Todo.find({}).select({ _id: 0, __v: 0 });
    return res.status(200).json({
      success: true,
      message: "getting data successfully done",
      todos,
    });
  } catch (error) {
    res.status(500).json({
      message: "Getting error to fetch todo",
      success: false,
      error,
    });
  }
});

// Get a todo by id
router.get("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res
        .status(404)
        .json({ message: "Todo not found", success: false });
    }

    return res
      .status(200)
      .json({ success: true, message: "successfully getting data", todo });
  } catch (error) {
    res.status(500).json({
      message: "Getting error to fetch todo",
      success: false,
      error,
    });
  }
});

// Post single todo
router.post("/", async (req, res) => {
  try {
    const newTodo = await Todo.create(req.body);
    console.log(newTodo);
    res
      .status(200)
      .json({ message: "Todo insert successfully", success: true, newTodo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Getting error to insert todo", success: false, error });
  }
});

// Post multiple  todo
router.post("/all", async (req, res) => {
  try {
    const newTodo = await Todo.insertMany(req.body);
    console.log(newTodo);
    res
      .status(200)
      .json({ message: "Todo insert successfully", success: true, newTodo });
  } catch (error) {
    res.status(500).json({
      message: "Getting error to insert todo",
      success: false,
      error,
    });
  }
});

// Put single todo
router.put("/updateOne/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // This option returns the updated document
    );
    if (!updatedTodo) {
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    }
    console.log(updatedTodo);
    return res
      .status(200)
      .json({ success: true, message: "Update successfully", updatedTodo });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Getting error to update todo", error });
  }
});

// Post multiple  todo
router.put("/updateMany", async (req, res) => {
  try {
    const result = await Todo.updateMany(
      { description: "test" }, // this is filter query,which are matched this condition they are update
      {
        $set: {
          status: "active", //this is new status set in the filtreated data
        },
      }
    );
    res
      .status(200)
      .json({ success: true, message: "Update status successfully", result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Getting error to update many todo",
      error,
    });
  }
});

// delete todo
router.delete("/:id", async (req, res) => {});

module.exports = router;
