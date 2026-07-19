const express = require("express");

const router = express.Router();

const {
  transferFunds,
  getTransactions,
  getAllTransactions,
} = require("../controllers/transactionController");

router.post("/transfer", transferFunds);

router.get("/admin/all", getAllTransactions);

router.get("/:userId", getTransactions);

module.exports = router;