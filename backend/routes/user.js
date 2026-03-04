const express = require("express");
const { z } = require("zod");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { User } = require("../db");
const authMiddleware = require("../middleware");
const bcrypt = require("bcrypt");

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
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      firstName,
      lastName,
      password: hashedPassword,
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

    const user = await User.findOne({ username });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
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

const updateSchema = z.object({
  password: z.string().min(6).optional(),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
});

router.put("/", authMiddleware, async (req, res) => {
  try {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid Inputs",
      });
    }

    const updateData = parsed.data;
    if (
      updateData.firstName == undefined &&
      updateData.lastName == undefined &&
      updateData.password == undefined
    ) {
      return res.status(400).json({
        message: "No fields provided to update",
      });
    }

    if (updateData.password != undefined) {
      const hashedPassword = await bcrypt.hash(updateData.password, 10);
      updateData.password = hashedPassword;
    }
    await User.updateOne(
      {
        _id: req.userId,
      },
      { $set: updateData },
    );

    return res.status(200).json({
      message: "Updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.get("/bulk", authMiddleware, async (req, res) => {
  try {
    const filter = req.query.filter || "";

    const users = await User.find({
      $or: [
        { firstName: { $regex: filter, $options: "i" } },
        { lastName: { $regex: filter, $options: "i" } },
      ],
      _id: { $ne: req.userId },
    }).select("firstName lastName _id");

    return res.status(200).json({
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
