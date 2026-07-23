import express from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getSalesData,
  getUserOrders,
  verifyPayment,
} from "./order.controller.js";
import { isAuthenticated } from "#middleware/isAuth.middleware.js";
import { isAdmin } from "#middleware/isAdmin.middleware.js";

const orderRouter = express.Router();

orderRouter.post("/create-order", isAuthenticated, createOrder);
orderRouter.post("/verify-payment", isAuthenticated, verifyPayment);
orderRouter.get("/myorders", isAuthenticated, getMyOrders);
orderRouter.get("/user-order/:userId", isAuthenticated, isAdmin, getUserOrders);
orderRouter.get("/all", isAuthenticated, isAdmin, getAllOrders);
orderRouter.get("/sales", isAuthenticated, isAdmin, getSalesData);

export default orderRouter;
