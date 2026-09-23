import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Transaction } from "../models/transaction.model.js";
import { Category } from "../models/category.model.js";

// get data from body, add validation on required fields, get the category object, create the transaction
const createTransaction = asyncHandler(async (req, res) => {
  const { transactionType, amount, categoryId, date, paymentMethod, message } =
    req.body;

  if (!(transactionType || amount || categoryId)) {
    throw new ApiError(
      400,
      "Transaction type, amount and category is required."
    );
  }

  const categoryObject = await Category.findById(categoryId);

  if (!categoryObject) {
    throw new ApiError(404, "Category not found.");
  }

  const transaction = await Transaction.create({
    userId: req.user?._id,
    transactionType,
    amount,
    category: {
      _id: categoryObject._id,
      name: categoryObject.name,
    },
    date,
    paymentMethod,
    message,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, transaction, "Transaction created successfully.")
    );
});

// get all transactions by the match method from aggregrate pipeline to fetch all transactions of logged in user
const getAllTransaction = asyncHandler(async (req, res) => {
  const transactions = await Transaction.aggregate([
    {
      $match: {
        userId: req.user?._id,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transactions, "Transactions fetched successfully.")
    );
});

// get a single transaction by it's id through qurery param
const getTransaction = asyncHandler(async (req, res) => {
  const {transactionId} = req.params;

  if (!transactionId) {
    throw new ApiError(400, "Transaction id is required.");
  }

  const transaction = await Transaction.findById(transactionId);
  return res
    .status(200)
    .json(
      new ApiResponse(200, transaction, "Transaction fetched successfully.")
    );
});

const updateTransaction = asyncHandler(async (req, res) => {
  // get the data by request body
  const {
    transactionId,
    transactionType,
    amount,
    category,
    date,
    paymentMethod,
    message,
  } = req.body;

  if (!transactionId) {
    throw new ApiError(400, "Transaction Id is required.");
  }

  if (!(
    transactionType ||
    amount ||
    category ||
    date ||
    paymentMethod ||
    message
  )) {
    throw new ApiError(400, "Atleast one field is required to update.");
  }

  //   declare an object
  const toUpdateData = {};

  //   conditional checks which fields to update if true than add into the object
  if (transactionType) toUpdateData.transactionType = transactionType;
  if (amount) toUpdateData.amount = amount;
  if (category) {
    const categoryObject = await Category.findById(category);
    toUpdateData.category = categoryObject;
  }
  if (date) toUpdateData.date = date;
  if (paymentMethod) toUpdateData.paymentMethod = paymentMethod;
  if (message) toUpdateData.message = message;

  //   find the transaction by id and update the data based on object created
  const updatedTransaction = await Transaction.findByIdAndUpdate(
    transactionId,
    {
      $set: toUpdateData,
    },
    { new: true, runValidators: true }
  );

  return res.status(200).json(new ApiResponse(200, updatedTransaction));
});

export {
  createTransaction,
  getAllTransaction,
  getTransaction,
  updateTransaction,
};
