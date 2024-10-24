// routes/userRoutes.js
// import { Router } from "express";
// import { 
//   createUser, 
//   deleteUser, 
//   loginUser, 
//   logoutUser , 
//   updateUser 
// } from "../controllers/userController.js";
// import { validateToken } from "../controllers/auth.js";


// const userRouter = Router();

// userRouter.post("/adduser", createUser);
// userRouter.post("/login", loginUser);
// userRouter.post("/logout", validateToken, logoutUser );
// userRouter.put("/update", validateToken, updateUser);
// userRouter.delete("/delete", validateToken,  deleteUser);

// export default userRouter;
// routes/userRoutes.js
const express = require("express");
const { 
  createUser, 
  deleteUser, 
  loginUser, 
  logoutUser, 
  updateUser 
} = require("../controllers/userController.js");
const { validateToken } = require("../controllers/auth.js");

const userRouter = express.Router();

userRouter.post("/adduser", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", validateToken, logoutUser);
// userRouter.put("/update", validateToken, updateUser);
// userRouter.delete("/delete", validateToken, deleteUser);

module.exports = userRouter;
