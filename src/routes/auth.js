// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const { User } = require("../../models");
// const router = express.Router();

// router.post("/register", async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, gender } = req.body;

//     const hashedPassword = await bcrypt.hash(password, 10);
//     console.log("Hashed password", hashedPassword);

//     const user = await User.create({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//       gender,
//     });

//     res.json({
//       message: "User register successfully",
//       data: user,
//     });
//   } catch (error) {
//     console.log("ERROR:", error);
//   }
// });

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check email in db
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       res.json({
//         message: `User email=${email} not found`,
//       });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       res.json({
//         message: `Invalid password`,
//       });
//     }

//     // Generate token
//     const token = jwt.sign(
//       {
//         id: user.id,
//         email: user.email,
//         fullName: user.firstName + user.lastName,
//       },
//       "sala-express",
//     );

//     res.json({
//       message: "User logged in successfully",
//       data: token,
//     });
//   } catch (error) {
//     console.log("ERROR:", error);
//   }
// });

// module.exports = router;


const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User } = require("../../models");
const router = express.Router();

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, gender } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
    });

    res.status(201).json({
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`,
      },
      process.env.JWT_SECRET || "sala-express",
      { expiresIn: "1d" } // 🔥 important
    );

    res.json({
      message: "User logged in successfully",
      data: token,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;