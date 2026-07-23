import express from "express";
import {
  changePassword,
  forgotPassword,
  login,
  logout,
  register,
  reVerify,
  verify,
  verifyOTP,
} from "./auth.controller.js";
import { isAuthenticated } from "#middleware/isAuth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/verify", verify);
authRouter.post("/reverify", reVerify);
authRouter.post("/login", login);
authRouter.post("/logout", isAuthenticated, logout);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/verify-otp/:email", verifyOTP);
authRouter.post("/change-password/:email", changePassword);

export default authRouter;
