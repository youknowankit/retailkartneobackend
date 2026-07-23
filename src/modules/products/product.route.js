import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "./product.controller.js";
import { isAuthenticated } from "#middleware/isAuth.middleware.js";
import { isAdmin } from "#middleware/isAdmin.middleware.js";
import { multipleUpload } from "#middleware/multer.middleware.js";

const productRouter = express.Router();

/*ADD PRODUCT:
1. Only admins can add product: isAuthenticated and isAdmin
2. Also, uploading image while adding product so we need multiple upload
*/

productRouter.post(
  "/add",
  isAuthenticated,
  isAdmin,
  multipleUpload,
  addProduct,
);

/*GET ALL PRODUCT */
productRouter.get("/getAllProducts", getAllProducts);

/*DELETE A PRODUCT */
productRouter.delete(
  "/delete/:productId",
  isAuthenticated,
  isAdmin,
  deleteProduct,
);

/*UPDATE PRODUCT */
productRouter.put(
  "/update/:productId",
  isAuthenticated,
  isAdmin,
  multipleUpload,
  updateProduct,
);
export default productRouter;
