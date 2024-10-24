// // controllers/userController.js
// import prisma from "../DB/db.config.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const saltRounds = 10;

// // Create User
// export const createUser  = async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     // Check if user already exists
//     const existingUser  = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existingUser ) {
//       return res.status(400).json({ error: "User  already exists" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Create new user
//     const newUser  = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//       },
//     });

//     res.status(201).json({ message: "User  registered successfully", user: newUser  });
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// // Login User
// export const loginUser  = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Find user by email
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     // Compare password
//     const isValidPassword = await bcrypt.compare(password, user.password);

//     if (!isValidPassword) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

//     res.cookie("accessToken", token, { httpOnly: true });
//     res.json({ message: "Login successful", token });
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// // Logout User
// export const logoutUser  = (req, res) => {
//   res.clearCookie("accessToken");
//   res.json({ message: "Logged out successfully" });
// };

// controllers/userController.js
// const prisma = require("../DB/db.config.js");
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const  prisma  = require("../database/dbConnection");

const saltRounds = 10;

// Create User
const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {console.error(error)
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    res.cookie("accessToken", token, { httpOnly: true });
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Logout User
const logoutUser = (req, res) => {
  res.clearCookie("accessToken");
  res.json({ message: "Logged out successfully" });
};

module.exports = {
  createUser,
  loginUser,
  logoutUser
};
