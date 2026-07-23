import express from "express";
import { allUser, getUserById, updateUser } from "./user.controller.js";
import { isAuthenticated } from "#middleware/isAuth.middleware.js";
import { isAdmin } from "#middleware/isAdmin.middleware.js";
import { singleUpload } from "#middleware/multer.middleware.js";

const userRouter = express.Router();

userRouter.get("/all-user", isAuthenticated, isAdmin, allUser);
userRouter.get("/get-user/:userId", getUserById);
userRouter.put("/update/:id", isAuthenticated, singleUpload, updateUser);

export default userRouter;
