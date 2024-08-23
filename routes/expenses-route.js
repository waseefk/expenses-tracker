const express = require("express");
const router = express.Router();
const Expense = require("../models/expense-model");
const authMiddleware = require("../middleware/auth-middleware");


router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.render("index", { expenses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const { name, amount } = req.body;
  try {
    const newExpense = new Expense({ name, amount });
    await newExpense.save();
    res.redirect("/expenses");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (expense) {
      res.render("edit", { expense });
    } else {
      res.status(404).send("Expense not found");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { name, amount } = req.body;
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { name, amount },
      { new: true }
    );
    if (updatedExpense) {
      res.redirect("/expenses");
    } else {
      res.status(404).send("Expense not found");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id/delete", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (expense) {
      res.render("delete", { expense });
    } else {
      res.status(404).send("Expense not found");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id/delete", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.redirect("/expenses");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
