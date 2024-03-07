import express from "express";
import formidable from "express-formidable";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";
import {
  addProduct,
  addProductReview,
  fetchAllProducts,
  fetchNewProducts,
  fetchProductByID,
  fetchProducts,
  fetchTopProducts,
  removeProduct,
  updateProductDetails,
  filterProducts,
} from "../controllers/productController.js";

const router = express.Router();

router
  .route("/")
  .post(authenticate, authorizeAdmin, formidable(), addProduct)
  .get(fetchProducts);
router.route("/allproducts").get(fetchAllProducts);
router.route("/top").get(fetchTopProducts);
router.route("/new").get(fetchNewProducts);
router.route("/filtered-products").post(filterProducts);
router.route("/:id/reviews").post(authenticate, checkId, addProductReview);
router
  .route("/:id")
  .get(fetchProductByID)
  .put(authenticate, authorizeAdmin, formidable(), updateProductDetails)
  .delete(authenticate, authorizeAdmin, removeProduct);

export default router;
