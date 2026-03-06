const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();
connectDB();

const app = express();

// ===== MIDDLEWARES =====
app.use(cors());
app.use(express.json());

// ===== TEST ROUTE (IMPORTANT FOR RENDER) =====
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully!");
});

// ===== REGISTER ROUTE =====
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const newUser = new User({
      username,
      email,
      password
    });

    await newUser.save();

    console.log("✅ User saved in DB");

    res.status(201).json({ msg: "User registered successfully" });

  } catch (error) {
    console.error("❌ Registration Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});