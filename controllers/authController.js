const { User } = require("../models");
const bcrypt = require('bcryptjs')

const authController = {
  createUser: async (req, res) => {
    const { name, username, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 8);
      const [newUser, created] = await User.findOrCreate({
        where: { username },
        defaults: { name, username, password: hashedPassword },
      });

      if (!created) {
        return res.status(409).json({ success: false, message: "Username already exists" });
      }

      req.session.user = { id: newUser.id, username: newUser.username };
      res.status(201).json({ success: true, message: "User created successfully", userId: newUser.id });
    } catch (error) {
      console.error("Error in createUser:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  loginUser: async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ where: { username } });
      if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = { id: user.id, name: user.name, username: user.username };
        res.status(200).json({ success: true, message: "Login successful" });
      } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error in loginUser:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  getUserDetails: async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    res.status(200).json({ success: true, user: req.session.user });
  },
};


module.exports = authController;
