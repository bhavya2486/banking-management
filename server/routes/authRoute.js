const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    registerCustomer
} = require("../controllers/AuthController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/register-customer", registerCustomer);

module.exports = router;