import asyncHandler from "../middlewares/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModal.js";

function calcPrice(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = parseFloat(itemsPrice * taxRate).toFixed(2);
  const total_Price = itemsPrice + shippingPrice + parseFloat(taxPrice);
  const totalPrice = total_Price.toFixed(2);
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

export const createOrder = asyncHandler(async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;
    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items.");
    }
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });
    if (!itemsFromDB) {
      res.status(404);
      throw new Error("Product not found!");
    } else {
      const dbOrderItems = orderItems.map((itemFromClient) => {
        const matchingItem = itemsFromDB.find(
          (i) => i._id.toString() === itemFromClient._id
        );
        return {
          ...itemFromClient,
          product: itemFromClient._id,
          price: matchingItem.price,
          _id: undefined,
        };
      });
      const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
        calcPrice(dbOrderItems);
      const order = new Order({
        orderItems: dbOrderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });
      const createdOrder = await order.save();
      res.status(200).json(createdOrder);
    }
  } catch (error) {
    console.log(error.message);
    throw new Error(error);
  }
});

export const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id username");
    res.status(200).json(orders);
  } catch (error) {
    console.log(error.message);
    throw new Error(error);
  }
});

export const getUserOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
  } catch (error) {
    console.log(error.message);
    throw new Error(error);
  }
});

export const countTotalOrders = asyncHandler(async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.status(200).json({ totalOrders });
  } catch (error) {
    console.log(error.message);
    throw new Error(error);
  }
});

export const caculateTotalSales = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.status(200).json({ totalSales });
  } catch (error) {
    console.log(error.message);
    throw new Error(error);
  }
});

export const caculateTotalSalesByDate = asyncHandler(async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: { isPaid: true },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    res.status(200).json(salesByDate);
  } catch (error) {
    console.log(error.message);
    throw new Error(error);
  }
});

export const findOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    console.log(error.message);
    throw new Error(error);
  }
});

export const markOrderAsPay = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };
      const updateOrder = await order.save();
      res.status(200).json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    console.log(error.message);
    throw new Error(error);
  }
});

export const markOrderAsDelivered = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updateOrder = await order.save();
      res.status(200).json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    console.log(error.message);
    throw new Error(error);
  }
});
