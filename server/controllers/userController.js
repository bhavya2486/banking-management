const User = require("../models/User");

const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const { name, phone, address, profileImage } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name;
    user.phone = phone;
    user.address = address;
    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    await user.save();

    res.status(200).json({
      message: "Profile Updated",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getCustomers,
};