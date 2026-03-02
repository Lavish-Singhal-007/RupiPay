const express = require("express");
const { z } = require("zod");
const router = express.Router();
const JWT_SECRET = require("../config");
const { User } = require("../db");

// Zod schema
const signupSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6),
  firstName: z.string().max(50),
  lastName: z.string().max(50),
});

router.post("/signup", async (req, res) => {
  try {
    // Validate input
    const parsed = signupSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid inputs",
      });
    }

    const { username, firstName, lastName, password } = parsed.data;

    // Check if user already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({
        message: "Username already taken",
      });
    }

    // Create user
    const user = await User.create({
      username,
      firstName,
      lastName,
      password,
    });

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    // Return token
    return res.status(201).json({
      message: "User created successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
