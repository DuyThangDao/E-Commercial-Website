import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

export const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: "Already exists" });
    }
    const category = await new Category({ name }).save();
    res.status(200).json(category);
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
});

export const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    category.name = name;
    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
});

export const removeCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    const removed = await Category.findByIdAndDelete(categoryId);

    res.status(200).json(removed);
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
});

export const listCategory = asyncHandler(async (req, res) => {
  try {
    const all = await Category.find({});
    res.status(200).json(all);
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
});

export const readCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    res.status(200).json(category);
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
});
