import razorpayInstance from "#config/razorpay.config.js";
import { Order } from "#modules/orders/order.model.js";
import { Cart } from "#modules/cart/cart.model.js";
import { User } from "#modules/users/user.model.js";
import { Product } from "#modules/products/product.model.js";

import asyncHandler from "#middleware/async.middleware.js";
import {
  createOrderService,
  getAllOrdersService,
  getMyOrdersService,
  getSalesDataService,
  getUserOrdersService,
  verifyPaymentService,
} from "./order.service.js";
import successResponse from "#shared/utils/apiResponse.util.js";

//CREATE ORDER
export const createOrder = asyncHandler(async (req, res) => {
  const { products, amount, tax, shipping, currency } = req.body;
  const userId = req.user._id;

  const razorpayOrder = await createOrderService({
    userId,
    productData: { products, amount, tax, shipping, currency },
  });

  successResponse(res, "Order created successfully", razorpayOrder, 201);

  // res.status(201).json({
  //   success: true,
  //   order: razorpayOrder,
  //   message: "Order created successfully",
  // });
});

//VERIFY PAYMENT
export const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    paymentFailed,
  } = req.body;

  const userId = req.user._id;

  const order = await verifyPaymentService({
    userId,
    razorpayData: {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentFailed,
    },
  });

  successResponse(
    res,
    "Payment verified and order updated successfully",
    order,
    200,
  );

  // return res.status(200).json({
  //   success: true,
  //   message: "Payment verified and order updated successfully",
  //   order,
  // });
});

//GET ORDERS
export const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.id;

  const orders = await getMyOrdersService({ userId });

  successResponse(res, "Orders fetched successfully", orders, 200);

  // res.status(200).json({
  //   success: true,
  //   count: orders.length,
  //   orders,
  // });
});

//GET ALL USER ORDERS (ADMIN)
export const getUserOrders = asyncHandler(async (req, res) => {
  const { userId } = req.params; //From URL via frontend

  const orders = await getUserOrdersService({ userId });

  successResponse(res, "Admin: User orders fetched successfully", orders, 200);

  // res.status(200).json({
  //   success: true,
  //   count: orders.length,
  //   orders,
  // });
});

// GET ALL ORDERS (ADMIN)
export const getAllOrders = asyncHandler(async (req, res) => {
  const data = await getAllOrdersService();

  successResponse(res, "Admin: All orders fetched successfully", data, 200);
  // res.status(200).json({
  //   success: true,
  //   count: orders.length,
  //   orders,
  // });
});

//Dashboard Sales Data
export const getSalesData = asyncHandler(async (req, res) => {
  const data = await getSalesDataService();

  successResponse(res, "Sales data fetched successfully", data, 200);

  // res.json({
  //   success: true,
  //   totalUsers,
  //   totalProducts,
  //   totalOrders,
  //   totalSales,
  //   sales: formattedSales,
  // });
});
