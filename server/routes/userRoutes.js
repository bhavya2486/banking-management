const express = require("express");

const router = express.Router();

const {
  getProfile,
  updateProfile,
  getCustomers,
} = require("../controllers/userController");

router.get("/customers", getCustomers);

router.get("/profile/:userId", getProfile);

router.put("/profile/:userId", updateProfile);

module.exports = router;