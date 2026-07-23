import { Product } from "#modules/products/product.model.js";
import { Cart } from "#modules/cart/cart.model.js";
import asyncHandler from "#middleware/async.middleware.js";
import CustomError from "#shared/errors/CustomError.util.js";
import {
  addToCartService,
  getCartService,
  removeFromCartService,
  updateQuantityService,
} from "./cart.service.js";
import successResponse from "#shared/utils/apiResponse.util.js";

//GET CART
export const getCart = asyncHandler(async (req, res) => {
  //would get from the middleware
  const userId = req.id;

  const cart = await getCartService({ userId });

  successResponse(res, "Cart fetched successfully", cart, 200);
});

//ADD TO CART
export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.id;
  const { productId } = req.body;

  const populatedCart = await addToCartService({ userId, productId });

  successResponse(
    res,
    "Product added to cart successfully",
    populatedCart,
    200,
  );
});

//UPDATE THE QTY IN CART
export const updateQuantity = asyncHandler(async (req, res) => {
  const userId = req.id;
  const { productId, type } = req.body;

  const cart = await updateQuantityService({ userId, productId, type });

  successResponse(res, "Cart updated successfully", cart, 200);
});

//REMOVE FROM CART
export const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.id;
  const { productId } = req.body;

  const cart = await removeFromCartService({ userId, productId });

  successResponse(res, "Product removed successfully", cart, 200);
});
