const express = require("express");
const { z } = require("zod");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
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
    const parsed = signupSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid Inputs",
      });
    }

    const { username, firstName, lastName, password } = parsed.data;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({
        message: "username already taken",
      });
    }

    const user = await User.create({
      username,
      firstName,
      lastName,
      password,
    });

    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET,
    );

    return res.status(201).json({
      message: "User created successfully",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

const signinSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

router.post("/signin", async (req, res) => {
  try {
    const parsed = signinSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(401).json({
        message: "Error while logging in",
      });
    }

    const { username, password } = parsed.data;
    const user = await User.findOne({ username, password });
    if (user) {
      const token = jwt.sign(
        {
          userId: user._id,
        },
        JWT_SECRET,
      );
      return res.status(200).json({
        token,
      });
    }
    return res.status(401).json({
      message: "Error while logging in",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
