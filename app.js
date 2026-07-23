import express from "express";
import userRoute from "#modules/users/user.route.js";
import productRoute from "#modules/products/product.route.js";
import cartRoute from "#modules/cart/cart.route.js";
import orderRoute from "#modules/orders/order.route.js";
import cors from "cors";
import errorMiddleware from "#middleware/error.middleware.js";
import authRouter from "#modules/auth/auth.route.js";

const app = express();

//middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

console.log(process.env.CLIENT_URL);

//Sample Route: http://localhost:8000/api/v1/user/register
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/order", orderRoute);

//Error Middelware
app.use(errorMiddleware);

export default app;
