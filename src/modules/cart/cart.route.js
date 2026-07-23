import express from "express";
import { isAuthenticated } from "#middleware/isAuth.middleware.js";
import {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
} from "./cart.controller.js";

const cartRouter = express.Router();

/********** CART ROUTES **********/

/*GET CART ITEMS */
cartRouter.get("/", isAuthenticated, getCart);

/*ADD TO CART */
cartRouter.post("/add", isAuthenticated, addToCart);

/*UPDATE QUANTITY */
cartRouter.put("/update", isAuthenticated, updateQuantity);

/*REMOVE FROM CART */
cartRouter.delete("/remove", isAuthenticated, removeFromCart);

export default cartRouter;
