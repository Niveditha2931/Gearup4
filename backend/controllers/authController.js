const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register a new user (Admin/Instructor/Student)
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser = { ...req.body, password: hashedPassword };
    const userDoc = new User(newUser);
    await userDoc.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// User login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

module.exports = {
  register,
  login,
};
