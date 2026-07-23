import { Product } from "#modules/products/product.model.js";
import getDataUri from "#shared/utils/dataUri.util.js";
import cloudinary from "#config/cloudinary.config.js";
import asyncHandler from "#middleware/async.middleware.js";
import CustomError from "#shared/errors/CustomError.util.js";
import {
  addProductService,
  deleteProductService,
  getAllProductsService,
  updateProductService,
} from "./product.service.js";
import successResponse from "#shared/utils/apiResponse.util.js";

export const addProduct = asyncHandler(async (req, res) => {
  const { productName, productDesc, productPrice, category, brand } = req.body;

  //check if something important is missing
  if (!productName || !productDesc || !productPrice || !category || !brand) {
    throw new CustomError("All fields are required!", 400);
  }

  //Middleware authentication will pass the userId
  const userId = req.id;
  const files = req.files;

  const newProduct = await addProductService({
    userId,
    productData: { productName, productDesc, productPrice, category, brand },
    files,
  });

  successResponse(res, "Product added successfully", newProduct, 201);

  // return res.status(200).json({
  //   success: true,
  //   message: "Product added successfully!",
  //   product: newProduct,
  // });
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await getAllProductsService();

  successResponse(res, "All Products fetched successfully!", products, 200);

  // return res.status(200).json({
  //   success: true,
  //   message: "All Products fetched successfully!",
  //   data: products,
  // });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  console.log(`request received for deletion ID:${productId}`);
  const status = await deleteProductService({ productId });
  
  successResponse(res, "Product deleted successfully", status, 200);

  // return res.status(200).json({
  //   success: true,
  //   message: "Product deleted successfully!",
  //   data: status,
  // });
});

export const updateProduct = asyncHandler(async (req, res) => {
  //get productID
  const { productId } = req.params;

  //get all fields
  const {
    productName,
    productDesc,
    productPrice,
    category,
    brand,
    existingImages,
  } = req.body;

  const files = req.files;

  const product = await updateProductService({
    productId,
    productData: {
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      existingImages,
    },
    files,
  });

  successResponse(res, "Product updated successfully", product, 200);

  // return res.status(200).json({
  //   success: true,
  //   message: "Product Updated Successfully!",
  //   product,
  // });
});
