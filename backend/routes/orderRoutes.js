import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import {
  caculateTotalSales,
  caculateTotalSalesByDate,
  countTotalOrders,
  createOrder,
  findOrderById,
  getAllOrders,
  getUserOrders,
  markOrderAsDelivered,
  markOrderAsPay,
} from "../controllers/orderController.js";

const router = express.Router();

router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizeAdmin, getAllOrders);
router.route("/mine").get(authenticate, getUserOrders);
router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(caculateTotalSales);
router.route("/total-sales-by-date").get(caculateTotalSalesByDate);
router.route("/:id").get(authenticate, findOrderById);
router.route("/:id/pay").put(authenticate, markOrderAsPay);
router
  .route("/:id/deliver")
  .put(authenticate, authorizeAdmin, markOrderAsDelivered);

export default router;
