import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Category } from "../models/category.model.js";

// createCategory function which get the name by req.body and create a DB entry
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new ApiError(400, "Category name is required.");
  }

  const category = await Category.create({
    name,
    createdBy: req.user?._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category created successfully."));
});

// update require the _id and name both find the object update it's value and return new object
const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId, name } = req.body;

  if (!categoryId) {
    throw new ApiError(400, "Category is required for update.");
  }

  if (!name) {
    throw new ApiError(400, "Name is required for update.");
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    {
      name,
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedCategory, "Category updated successfuly.")
    );
});

// get a category by it's id
const getCategory = asyncHandler(async (req, res) => {
  const {categoryId} = req.params;

  if(!categoryId) {
    throw new ApiError(400, "Category Id is required.")
  }

  const category = await Category.findById(categoryId);

  if(!category) {
    throw new ApiError(404, "Category not found.")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category fetched successfully."));
});

// get all categories by a user. Used aggregation pipeline for finding all categories created by logged in user
const getAllCategories = asyncHandler(async (req, res) => {
  // aggregate method provide us many prebuilt operators to use. The $match operator match the field from a Schema by any value we provided. In our case we are matching the createdBy field from the Category schema by the logged in user's _id. It returns the value in array.
  const categories = await Category.aggregate([
    {
      $match: {
        createdBy: req.user?._id,
      },
    },
  ]);

  if(!categories?.length) {
    throw new ApiError(404, "No categories found.")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

export { createCategory, updateCategory, getCategory, getAllCategories };
