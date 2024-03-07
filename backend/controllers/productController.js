import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModal.js";

export const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;
    //Validation
    switch (true) {
      case !name:
        return res.status(400).json({ error: "Name is required." });
      case !description:
        return res.status(400).json({ error: "Description is required." });
      case !price:
        return res.status(400).json({ error: "Price is required." });
      case !category:
        return res.status(400).json({ error: "Category is required." });
      case !quantity:
        return res.status(400).json({ error: "Quantity is required." });
      case !brand:
        return res.status(400).json({ error: "Brand is required." });
    }
    const product = new Product({ ...req.fields });
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

export const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;
    //Validation
    switch (true) {
      case !name:
        return res.status(400).json({ error: "Name is required." });
      case !description:
        return res.status(400).json({ error: "Description is required." });
      case !price:
        return res.status(400).json({ error: "Price is required." });
      case !category:
        return res.status(400).json({ error: "Category is required." });
      case !quantity:
        return res.status(400).json({ error: "Quantity is required." });
      case !brand:
        return res.status(400).json({ error: "Brand is required." });
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true }
    );
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

export const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

export const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find(keyword).limit(pageSize);
    res.status(200).json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

export const fetchProductByID = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404);
      throw new Error("Product not found.");
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

export const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

export const addProductReview = asyncHandler(async (req, res) => {
  try {
    console.log(req.user);
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }
      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
      console.log(product);
      await product.save();
      res.status(200).json({ message: "Review added." });
    } else {
      res.status(404);
      throw new Error("Product not found.");
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

export const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

export const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ _id: -1 }).limit(4);
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

export const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await Product.find(args);
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});
