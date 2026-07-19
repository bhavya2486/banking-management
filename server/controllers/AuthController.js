const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateUniqueAccountNumber = async () => {
  let accountNumber;
  let existingAccount;

  do {
    accountNumber = Math.floor(
      1000000000 + Math.random() * 9000000000
    );

    existingAccount = await User.findOne({
      accountNumber,
    });
  } while (existingAccount);

  return accountNumber;
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const accountNumber =
      await generateUniqueAccountNumber();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      accountNumber,
      role: "admin",
      balance: 0,
    });

    res.status(201).json({
      message: "Registration Successful",
      accountNumber: user.accountNumber,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountNumber: user.accountNumber,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phone, balance, role, profileImage } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const accountNumber = await generateUniqueAccountNumber();

    const userRole = role === "admin" ? "admin" : "customer";
    const userBalance = userRole === "admin" ? 0 : (balance !== undefined && balance !== "" ? Number(balance) : 50000);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      accountNumber,
      balance: userBalance,
      role: userRole,
      profileImage: profileImage || "",
    });

    res.status(201).json({
      message: `${userRole === "admin" ? "Admin" : "Customer"} Account Created Successfully`,
      accountNumber: user.accountNumber,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  registerCustomer,
};